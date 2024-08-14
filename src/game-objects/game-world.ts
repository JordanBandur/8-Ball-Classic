import { IInputConfig, IBallConfig, ITableConfig, IVector2, IPhysicsConfig, IAssetsConfig, ILabelsConfig, IMatchScoreConfig, IAIConfig } from './../game.config.type';
import { AI } from './../ai/ai-trainer';
import { mapRange } from '../common/helper';
import { Referee } from './referee';
import { Player } from './player';
import { Stick } from './stick';
import { Color } from '../common/color';
import { Vector2 } from '../physics/vector2';
import { GameConfig } from '../game.config';
import { Assets } from '../assets';
import { Canvas2D } from '../canvas';
import { Ball } from './ball';
import { Mouse } from '../input/mouse';
import { State } from './state';

//------Configurations------//

// Load configurations from the game configuration
const physicsConfig: IPhysicsConfig = GameConfig.physics;
const inputConfig: IInputConfig = GameConfig.input;
const ballConfig: IBallConfig = GameConfig.ball;
const tableConfig: ITableConfig = GameConfig.table;
const labelsConfig: ILabelsConfig = GameConfig.labels;
const matchScoreConfig: IMatchScoreConfig = GameConfig.matchScore;
const aiConfig: IAIConfig = GameConfig.ai;
const gameSize: IVector2 = GameConfig.gameSize;
const sprites: IAssetsConfig = GameConfig.sprites;
const sounds: IAssetsConfig = GameConfig.sounds;

/**
 * GameWorld
 *
 * This class represents the entire game world and is responsible for managing the game's state.
 * It handles the initialization of the match, player turns, ball movements, collisions, scoring,
 * and rendering of the game elements on the canvas. The GameWorld class integrates the physics,
 * input, AI, and game rules to provide a seamless gameplay experience.
 */
export class GameWorld {

  //------Members------//

  private _stick: Stick;                  // The cue stick used by the player
  private _cueBall: Ball;                 // The cue ball in the game
  private _8Ball: Ball;                   // The eight ball in the game
  private _balls: Ball[];                 // Array of all balls in the game
  private _players: Player[] = [new Player(), new Player()];  // Array of players (two-player game)
  private _currentPlayerIndex = 0;        // Index of the current player in the _players array
  private _turnState: State;              // The state of the current turn
  private _referee: Referee;              // The referee that enforces game rules

  //------Properties------//

  /**
   * Gets the current player who is taking their turn.
   *
   * @returns {Player} The current player.
   */
  public get currentPlayer(): Player {
    return this._players[this._currentPlayerIndex];
  }

  /**
   * Gets the next player who will take their turn after the current player.
   *
   * @returns {Player} The next player.
   */
  public get nextPlayer(): Player {
    return this._players[(this._currentPlayerIndex + 1) % this._players.length];
  }

  /**
   * Gets the array of all balls currently in play.
   *
   * @returns {Ball[]} Array of balls in the game.
   */
  public get balls(): Ball[] {
    return this._balls;
  }

  /**
   * Checks whether the cue ball is in hand, allowing it to be placed by the player.
   *
   * @returns {boolean} True if the cue ball is in hand, false otherwise.
   */
  public get isBallInHand(): boolean {
    return this._turnState.ballInHand;
  }

  /**
   * Checks whether the current turn is valid according to the game rules.
   *
   * @returns {boolean} True if the turn is valid, false otherwise.
   */
  public get isTurnValid(): boolean {
    return this._turnState.isValid;
  }

  /**
   * Checks whether the game is over based on the current game state.
   *
   * @returns {boolean} True if the game is over, false otherwise.
   */
  public get isGameOver(): boolean {
    return this._referee.isGameOver(this.currentPlayer, this._cueBall, this._8Ball);
  }

  /**
   * Checks whether any balls are currently moving on the table.
   *
   * @returns {boolean} True if any balls are moving, false otherwise.
   */
  public get isBallsMoving(): boolean {
    return this._balls.some(ball => ball.moving);
  }

  /**
   * Gets the number of balls that were pocketed during the current turn.
   *
   * @returns {number} The number of pocketed balls.
   */
  public get numOfPocketedBallsOnTurn(): number {
    return this._turnState.pocketedBalls.length;
  }

  //------Constructor------//

  /**
   * Constructs an instance of the GameWorld class and initializes a new match.
   */
  constructor() {
    this.initMatch();
  }

  //------Private Methods------//

  /**
   * Retrieves all balls of a specific color from the game.
   *
   * @param {Color} color - The color of the balls to retrieve.
   * @returns {Ball[]} An array of balls matching the specified color.
   */
  private getBallsByColor(color: Color): Ball[] {
    return this._balls.filter((ball: Ball) => ball.color === color);
  }

  /**
   * Handles player input for shooting the cue ball.
   * If the AI session is finished and the player clicks the mouse, the cue ball is shot.
   */
  private handleInput(): void {
    if (AI.finishedSession && Mouse.isPressed(inputConfig.mouseShootButton)) {
      this.shootCueBall(this._stick.power, this._stick.rotation);
    }
  }

  /**
   * Checks whether a ball's position is outside the top border of the table.
   *
   * @param {Vector2} position - The position of the ball to check.
   * @returns {boolean} True if the ball is outside the top border, false otherwise.
   */
  private isBallPosOutsideTopBorder(position: Vector2): boolean {
    const topBallEdge: number = position.y - ballConfig.diameter / 2;
    return topBallEdge <= tableConfig.cushionWidth;
  }

  /**
   * Checks whether a ball's position is outside the left border of the table.
   *
   * @param {Vector2} position - The position of the ball to check.
   * @returns {boolean} True if the ball is outside the left border, false otherwise.
   */
  private isBallPosOutsideLeftBorder(position: Vector2): boolean {
    const leftBallEdge: number = position.x - ballConfig.diameter / 2;
    return leftBallEdge <= tableConfig.cushionWidth;
  }

  /**
   * Checks whether a ball's position is outside the right border of the table.
   *
   * @param {Vector2} position - The position of the ball to check.
   * @returns {boolean} True if the ball is outside the right border, false otherwise.
   */
  private isBallPosOutsideRightBorder(position: Vector2): boolean {
    const rightBallEdge: number = position.x + ballConfig.diameter / 2;
    return rightBallEdge >= gameSize.x - tableConfig.cushionWidth;
  }

  /**
   * Checks whether a ball's position is outside the bottom border of the table.
   *
   * @param {Vector2} position - The position of the ball to check.
   * @returns {boolean} True if the ball is outside the bottom border, false otherwise.
   */
  private isBallPosOutsideBottomBorder(position: Vector2): boolean {
    const bottomBallEdge: number = position.y + ballConfig.diameter / 2;
    return bottomBallEdge >= gameSize.y - tableConfig.cushionWidth;
  }

  /**
   * Handles the collision of a ball with the top cushion, reversing its velocity
   * and repositioning it inside the table boundaries.
   *
   * @param {Ball} ball - The ball that collided with the top cushion.
   */
  private handleCollisionWithTopCushion(ball: Ball): void {
    ball.position = ball.position.addY(tableConfig.cushionWidth - ball.position.y + ballConfig.diameter / 2);
    ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y);
  }

  /**
   * Handles the collision of a ball with the left cushion, reversing its velocity
   * and repositioning it inside the table boundaries.
   *
   * @param {Ball} ball - The ball that collided with the left cushion.
   */
  private handleCollisionWithLeftCushion(ball: Ball): void {
    ball.position = ball.position.addX(tableConfig.cushionWidth - ball.position.x + ballConfig.diameter / 2);
    ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y);
  }

  /**
   * Handles the collision of a ball with the right cushion, reversing its velocity
   * and repositioning it inside the table boundaries.
   *
   * @param {Ball} ball - The ball that collided with the right cushion.
   */
  private handleCollisionWithRightCushion(ball: Ball): void {
    ball.position = ball.position.addX(gameSize.x - tableConfig.cushionWidth - ball.position.x - ballConfig.diameter / 2);
    ball.velocity = new Vector2(-ball.velocity.x, ball.velocity.y);
  }

  /**
   * Handles the collision of a ball with the bottom cushion, reversing its velocity
   * and repositioning it inside the table boundaries.
   *
   * @param {Ball} ball - The ball that collided with the bottom cushion.
   */
  private handleCollisionWithBottomCushion(ball: Ball): void {
    ball.position = ball.position.addY(gameSize.y - tableConfig.cushionWidth - ball.position.y - ballConfig.diameter / 2);
    ball.velocity = new Vector2(ball.velocity.x, -ball.velocity.y);
  }

  /**
   * Resolves the collision of a ball with any of the table cushions.
   * If a collision is detected, the ball's velocity is adjusted to account for energy loss.
   *
   * @param {Ball} ball - The ball to check and handle collisions for.
   */
  private resolveBallCollisionWithCushion(ball: Ball): void {

    let collided: boolean = false;

    if (this.isBallPosOutsideTopBorder(ball.nextPosition)) {
      this.handleCollisionWithTopCushion(ball);
      collided = true;
    }
    if (this.isBallPosOutsideLeftBorder(ball.nextPosition)) {
      this.handleCollisionWithLeftCushion(ball);
      collided = true;
    }
    if (this.isBallPosOutsideRightBorder(ball.nextPosition)) {
      this.handleCollisionWithRightCushion(ball);
      collided = true;
    }
    if (this.isBallPosOutsideBottomBorder(ball.nextPosition)) {
      this.handleCollisionWithBottomCushion(ball);
      collided = true;
    }

    if (collided) {
      ball.velocity = ball.velocity.mult(1 - physicsConfig.collisionLoss);
    }
  }

  /**
   * Resolves the collision between two balls, adjusting their positions and velocities accordingly.
   *
   * @param {Ball} first - The first ball involved in the collision.
   * @param {Ball} second - The second ball involved in the collision.
   * @returns {boolean} True if a collision occurred, false otherwise.
   */
  private resolveBallsCollision(first: Ball, second: Ball): boolean {

    if (!first.visible || !second.visible) {
      return false;
    }

    // Find a normal vector
    const n: Vector2 = first.position.subtract(second.position);

    // Find distance
    const dist: number = n.length;

    if (dist > ballConfig.diameter) {
      return false;
    }

    // Find minimum translation distance
    const mtd = n.mult((ballConfig.diameter - dist) / dist);

    // Push-pull balls apart
    first.position = first.position.add(mtd.mult(0.5));
    second.position = second.position.subtract(mtd.mult(0.5));

    // Find unit normal vector
    const un = n.mult(1 / n.length);

    // Find unit tangent vector
    const ut = new Vector2(-un.y, un.x);

    // Project velocities onto the unit normal and unit tangent vectors
    const v1n: number = un.dot(first.velocity);
    const v1t: number = ut.dot(first.velocity);
    const v2n: number = un.dot(second.velocity);
    const v2t: number = ut.dot(second.velocity);

    // Convert the scalar normal and tangential velocities into vectors
    const v1nTag: Vector2 = un.mult(v2n);
    const v1tTag: Vector2 = ut.mult(v1t);
    const v2nTag: Vector2 = un.mult(v1n);
    const v2tTag: Vector2 = ut.mult(v2t);

    // Update velocities
    first.velocity = v1nTag.add(v1tTag);
    second.velocity = v2nTag.add(v2tTag);

    first.velocity = first.velocity.mult(1 - physicsConfig.collisionLoss);
    second.velocity = second.velocity.mult(1 - physicsConfig.collisionLoss);

    return true;
  }

  /**
   * Handles all collisions in the game, including ball-to-ball and ball-to-cushion collisions.
   * It also plays a sound effect when balls collide.
   */
  private handleCollisions(): void {
    for (let i = 0; i < this._balls.length; i++) {

      this.resolveBallCollisionWithCushion(this._balls[i]);

      for (let j = i + 1; j < this._balls.length; j++) {
        const firstBall = this._balls[i];
        const secondBall = this._balls[j];
        const collided = this.resolveBallsCollision(firstBall, secondBall);

        if (collided) {
          const force: number = firstBall.velocity.length + secondBall.velocity.length;
          const volume: number = mapRange(force, 0, ballConfig.maxExpectedCollisionForce, 0, 1);
          Assets.playSound(sounds.paths.ballsCollide, volume);

          if (!this._turnState.firstCollidedBallColor) {
            const color: Color = firstBall.color === Color.white ? secondBall.color : firstBall.color;
            this._turnState.firstCollidedBallColor = color;
          }
        }
      }
    }
  }

  /**
   * Checks if a given ball position is inside one of the table's pockets.
   *
   * @param {Vector2} position - The position of the ball to check.
   * @returns {boolean} True if the ball is inside a pocket, false otherwise.
   */
  private isInsidePocket(position: Vector2): boolean {
    return tableConfig.pocketsPositions
      .some((pocketPos: Vector2) => position.distFrom(pocketPos) <= tableConfig.pocketRadius);

  }

  /**
   * Handles the event when a ball enters a pocket, hiding it from the table.
   *
   * @param {Ball} ball - The ball to check and hide if it is pocketed.
   */
  private resolveBallInPocket(ball: Ball): void {

    if (this.isInsidePocket(ball.position)) {
      ball.hide();
    }
  }

  /**
   * Checks if the ball color is valid for a player's assigned color (red or yellow).
   *
   * @param {Color} color - The color of the ball to check.
   * @returns {boolean} True if the ball color is valid, false otherwise.
   */
  private isValidPlayerColor(color: Color): boolean {
    return color === Color.red || color === Color.yellow;
  }

  /**
   * Handles balls that are pocketed during a turn, updating the game state and player assignments.
   */
  private handleBallsInPockets(): void {
    this._balls.forEach((ball: Ball) => {
      this.resolveBallInPocket(ball);
      if (!ball.visible && !this._turnState.pocketedBalls.includes(ball)) {
        Assets.playSound(sounds.paths.rail, 1);
        if (!this.currentPlayer.color && this.isValidPlayerColor(ball.color)) {
          this.currentPlayer.color = ball.color;
          this.nextPlayer.color = ball.color === Color.yellow ? Color.red : Color.yellow;
        }
        this._turnState.pocketedBalls.push(ball);
      }
    });
  }

  /**
   * Handles the event when the cue ball is in hand, allowing the player to place it on the table.
   */
  private handleBallInHand(): void {

    if (Mouse.isPressed(inputConfig.mousePlaceBallButton) && this.isValidPosToPlaceCueBall(Mouse.position)) {
      this.placeBallInHand(Mouse.position);
    }
    else {
      this._stick.movable = false;
      this._stick.visible = false;
      this._cueBall.position = Mouse.position;
    }
  }

  /**
   * Handles the end of the game, updating the overall score and starting a new match.
   */
  private handleGameOver(): void {
    if (this._turnState.isValid) {
      this.currentPlayer.overallScore++;
    }
    else {
      this.nextPlayer.overallScore++;
    }
    this.initMatch();
  }

  /**
   * Moves the game to the next turn, handling fouls and changing the current player if necessary.
   */
  private nextTurn(): void {

    const foul = !this._turnState.isValid;

    if (this.isGameOver) {
      this.handleGameOver();
      return;
    }

    if (!this._cueBall.visible) {
      this._cueBall.show(Vector2.copy(GameConfig.cueBallPosition));
    }

    if (foul || this._turnState.pocketedBalls.length === 0) {
      this._currentPlayerIndex++;
      this._currentPlayerIndex = this._currentPlayerIndex % this._players.length;
    }

    this._stick.show(this._cueBall.position);

    this._turnState = new State();
    this._turnState.ballInHand = foul;

    if (this.isAITurn()) {
      AI.startSession(this);
    }
  }

  /**
   * Draws the label for the current player, indicating whose turn it is.
   */
  private drawCurrentPlayerLabel(): void {

    Canvas2D.drawText(
      labelsConfig.currentPlayer.text + (this._currentPlayerIndex + 1),
      labelsConfig.currentPlayer.font,
      labelsConfig.currentPlayer.color,
      labelsConfig.currentPlayer.position,
      labelsConfig.currentPlayer.alignment
    );
  }

  /**
   * Draws the match scores for each player, indicating the number of balls pocketed.
   */
  private drawMatchScores(): void {
    for (let i = 0; i < this._players.length; i++) {
      for (let j = 0; j < this._players[i].matchScore; j++) {
        const scorePosition: Vector2 = Vector2.copy(matchScoreConfig.scoresPositions[i]).addToX(j * matchScoreConfig.unitMargin);
        const scoreSprite: HTMLImageElement = this._players[i].color === Color.red ? Assets.getSprite(sprites.paths.redScore) : Assets.getSprite(sprites.paths.yellowScore);
        Canvas2D.drawImage(scoreSprite, scorePosition);
      }
    }
  }

  /**
   * Draws the overall scores for each player, indicating their total score across all matches.
   */
  private drawOverallScores(): void {
    for (let i = 0; i < this._players.length; i++) {
      Canvas2D.drawText(
        this._players[i].overallScore.toString(),
        labelsConfig.overalScores[i].font,
        labelsConfig.overalScores[i].color,
        labelsConfig.overalScores[i].position,
        labelsConfig.overalScores[i].alignment
      );
    }
  }

  /**
   * Checks whether a position is within the valid boundaries of the table, excluding pockets.
   *
   * @param {Vector2} position - The position to check.
   * @returns {boolean} True if the position is inside the table boundaries, false otherwise.
   */
  private isInsideTableBoundaries(position: Vector2): boolean {
    let insideTable: boolean = !this.isInsidePocket(position);
    insideTable = insideTable && !this.isBallPosOutsideTopBorder(position);
    insideTable = insideTable && !this.isBallPosOutsideLeftBorder(position);
    insideTable = insideTable && !this.isBallPosOutsideRightBorder(position);
    insideTable = insideTable && !this.isBallPosOutsideBottomBorder(position);

    return insideTable;
  }

  /**
   * Checks if it is the AI's turn to play.
   *
   * @returns {boolean} True if it is the AI's turn, false otherwise.
   */
  private isAITurn(): boolean {
    return AI.finishedSession && aiConfig.on && this._currentPlayerIndex === aiConfig.playerIndex;
  }

  //------Public Methods------//

  /**
   * Initializes a new match, setting up the balls, players, and other game elements.
   */
  public initMatch(): void {

    const redBalls: Ball[] = GameConfig.redBallsPositions
      .map((position: Vector2) => new Ball(Vector2.copy(position), Color.yellow));

    const yellowBalls: Ball[] = GameConfig.yellowBallsPositions
      .map((position: Vector2) => new Ball(Vector2.copy(position), Color.red));

    this._8Ball = new Ball(Vector2.copy(GameConfig.eightBallPosition), Color.black);

    this._cueBall = new Ball(Vector2.copy(GameConfig.cueBallPosition), Color.white);

    this._stick = new Stick(Vector2.copy(GameConfig.cueBallPosition));

    this._balls = [
      ...redBalls,
      ...yellowBalls,
      this._8Ball,
      this._cueBall,
    ];

    this._currentPlayerIndex = 0;

    this._players.forEach((player: Player) => {
      player.matchScore = 0;
      player.color = null;
    });
    this._turnState = new State();
    this._referee = new Referee();

    if (this.isAITurn()) {
      AI.startSession(this);
    }
  }

  /**
   * Checks if a given position is valid for placing the cue ball.
   *
   * @param {Vector2} position - The position to check.
   * @returns {boolean} True if the position is valid, false otherwise.
   */
  public isValidPosToPlaceCueBall(position: Vector2): boolean {
    let noOverlap: boolean = this._balls.every((ball: Ball) => {
      return ball.color === Color.white ||
        ball.position.distFrom(position) > ballConfig.diameter;
    });

    return noOverlap && this.isInsideTableBoundaries(position);
  }

  /**
   * Places the cue ball at the specified position on the table.
   *
   * @param {Vector2} position - The position where the cue ball should be placed.
   */
  public placeBallInHand(position: Vector2): void {
    this._cueBall.position = position;
    this._turnState.ballInHand = false;
    this._stick.show(this._cueBall.position);
  }

  /**
   * Concludes the current turn, updating the game state and scores based on the turn's outcome.
   */
  public concludeTurn(): void {

    this._turnState.pocketedBalls.forEach((ball: Ball) => {
      const ballIndex: number = this._balls.indexOf(ball);
      if (ball.color != Color.white) {
        this._balls.splice(ballIndex, 1);
      }
    });

    if (this.currentPlayer.color) {
      this.currentPlayer.matchScore = 8 - this.getBallsByColor(this.currentPlayer.color).length - this.getBallsByColor(Color.black).length;
    }

    if (this.nextPlayer.color) {
      this.nextPlayer.matchScore = 8 - this.getBallsByColor(this.nextPlayer.color).length - this.getBallsByColor(Color.black).length;
    }

    this._turnState.isValid = this._referee.isValidTurn(this.currentPlayer, this._turnState);
  }

  /**
   * Shoots the cue ball with the specified power and rotation, triggering the game physics.
   *
   * @param {number} power - The power with which to shoot the cue ball.
   * @param {number} rotation - The angle (in radians) at which to shoot the cue ball.
   */
  public shootCueBall(power: number, rotation: number): void {
    if (power > 0) {
      this._stick.rotation = rotation;
      this._stick.shoot();
      this._cueBall.shoot(power, rotation);
      this._stick.movable = false;
      setTimeout(() => this._stick.hide(), GameConfig.timeoutToHideStickAfterShot);
    }
  }

  /**
   * Updates the game state, handling ball movements, collisions, player input, and AI behavior.
   * This method is called on every frame to keep the game running smoothly.
   */
  public update(): void {

    if (this.isBallInHand) {
      this.handleBallInHand();
      return;
    }

    this.handleBallsInPockets();
    this.handleCollisions();
    this.handleInput();
    this._stick.update();
    this._balls.forEach((ball: Ball) => ball.update());

    if (!this.isBallsMoving && !this._stick.visible) {
      this.concludeTurn();
      this.nextTurn();
    }
  }

  /**
   * Draws the entire game world, including the table, balls, stick, and UI elements such as scores.
   * This method is called on every frame to render the game's visuals.
   */
  public draw(): void {
    Canvas2D.drawImage(Assets.getSprite(sprites.paths.table));
    this.drawCurrentPlayerLabel();
    this.drawMatchScores();
    this.drawOverallScores();
    this._balls.forEach((ball: Ball) => ball.draw());
    this._stick.draw();
  }
}
