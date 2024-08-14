import { IAIConfig, IStickConfig } from './../game.config.type';
import { Vector2 } from './../physics/vector2';
import { GameConfig } from './../game.config';
import { GameWorld } from './../game-objects/game-world';
import { AIOpponent } from './ai-opponent';
import { AIPolicy } from './ai-policy';
import cloneDeep from 'lodash/cloneDeep';
import { Mouse } from '../input/mouse';

// Load configurations from the game configuration
const aiConfig: IAIConfig = GameConfig.ai;
const stickConfig: IStickConfig = GameConfig.stick;

/**
 * AITrainer
 *
 * This class is responsible for training the AI opponent in the game. It manages the process of
 * simulating turns, evaluating the AI's performance, and adjusting its strategy through mutation
 * and randomization. The AITrainer uses a policy to evaluate different game states and iteratively
 * improves the AI's ability to play the game.
 */
export class AITrainer {

  private _policy: AIPolicy;             // The policy used to evaluate game states
  private _opponents: AIOpponent[];      // Array of AI opponents generated during training
  private _currentOpponent: AIOpponent;  // The AI opponent currently being tested
  private _initialGameWorld: GameWorld;  // The initial game state used for training
  private _gameWorld: GameWorld;         // The game state during the current iteration of training
  private _iteration: number = 0;        // The current iteration of the training process
  private _finishedSession: boolean = true; // Flag indicating whether the training session is complete
  private _bestOpponent: AIOpponent;     // The best-performing AI opponent found during training
  private _soundOnState: boolean;        // Stores the original sound state to restore after training

  //------Properties------//

  /**
   * Indicates whether the current training session has finished.
   *
   * @returns {boolean} True if the session is finished, false otherwise.
   */
  public get finishedSession(): boolean {
    return this._finishedSession;
  }

  //------Constructor------//

  /**
   * Constructs an instance of the AITrainer class and initializes the evaluation policy.
   */
  constructor() {
    this._policy = new AIPolicy();
  }

  //------Private Methods------//

  /**
   * Places the cue ball in a valid position when the ball is in hand.
   * This method adjusts the ball's position to ensure it is in a valid location according to game rules.
   *
   * @param {GameWorld} gameWorld - The current game world where the ball will be placed.
   */
  private placeBallInHand(gameWorld: GameWorld): void {
    debugger;

    let marginX = 5;
    let pos = Vector2.copy(GameConfig.cueBallPosition);

    while (!gameWorld.isValidPosToPlaceCueBall(pos)) {
      pos.addToX(marginX);
    }

    gameWorld.placeBallInHand(pos);
  }

  /**
   * Initializes the AI training process by resetting opponents, iterations, and selecting a random opponent.
   */
  private init(): void {
    this._opponents = [];
    this._currentOpponent = this.createRandomOpponent();
    this._bestOpponent = this._currentOpponent;
    this._iteration = 0;
  }

  /**
   * Creates a mutated version of the given opponent. The mutation involves slight changes 
   * to the shot power and rotation angle, simulating variability in the AI's behavior.
   *
   * @param {AIOpponent} opponent - The AI opponent to mutate.
   * @returns {AIOpponent} A new mutated AI opponent.
   */
  private createMutation(opponent: AIOpponent): AIOpponent {
    let newPower = opponent.power;
    newPower += (Math.random() * 2 * aiConfig.shotPowerMutationVariance) - aiConfig.shotPowerMutationVariance;
    newPower = newPower < aiConfig.minShotPower ? aiConfig.minShotPower : newPower;
    newPower = newPower > stickConfig.maxPower ? stickConfig.maxPower : newPower;

    let newRotation = opponent.rotation;

    if (opponent.evaluation > 0) {
      newRotation += (1 / opponent.evaluation) * (Math.random() * 2 * Math.PI - Math.PI);
    } else {
      newRotation = (Math.random() * 2 * Math.PI - Math.PI);
    }

    return new AIOpponent(newPower, newRotation);
  }

  /**
   * Creates a new AI opponent with random power and rotation values.
   *
   * @returns {AIOpponent} A new AI opponent with randomized attributes.
   */
  private createRandomOpponent(): AIOpponent {
    const power: number = (Math.random() * 75 + 1);
    const rotation: number = (Math.random() * 2 * Math.PI);

    return new AIOpponent(power, rotation);
  }

  /**
   * Performs a single training iteration, simulating the AI's turn and evaluating its performance.
   * The AI's performance is recorded, and the process repeats until the set number of iterations is reached.
   */
  private train(): void {

    if (this._iteration === aiConfig.trainIterations) {
      GameConfig.soundOn = this._soundOnState;
      this.playTurn();
      this._finishedSession = true;
      return;
    }

    if (this._gameWorld.isBallsMoving) return;
    this._gameWorld.concludeTurn();

    this._currentOpponent.evaluation = this._policy.evaluate(this._gameWorld);

    const current: AIOpponent = new AIOpponent(
      this._currentOpponent.power,
      this._currentOpponent.rotation,
      this._currentOpponent.evaluation
    );

    this._opponents.push(current);

    if (current.evaluation > this._bestOpponent.evaluation) {
      this._bestOpponent = current;
    }

    this._gameWorld = cloneDeep(this._initialGameWorld);
    this._currentOpponent = this.buildNewOpponent();
    this._iteration++;
    this.simulate();
  }

  //------Public Methods------//

  /**
   * Builds a new AI opponent by either creating a random opponent or mutating the best-performing opponent.
   *
   * @returns {AIOpponent} The newly created or mutated AI opponent.
   */
  public buildNewOpponent(): AIOpponent {
    if (this._iteration % 10 === 0) {
      return this.createRandomOpponent();
    } else {
      return this.createMutation(this._bestOpponent);
    }
  }

  /**
   * Executes the best AI opponent's turn by shooting the cue ball with the calculated power and rotation.
   */
  public playTurn(): void {
    this._initialGameWorld.shootCueBall(this._bestOpponent.power, this._bestOpponent.rotation);
  }

  /**
   * Simulates a turn for the current AI opponent by shooting the cue ball in the game world.
   */
  public simulate(): void {
    this._gameWorld.shootCueBall(this._currentOpponent.power, this._currentOpponent.rotation);
  }

  /**
   * Runs the training loop, continuously training and updating the AI until the session is complete.
   * This method is called to iteratively improve the AI's performance through simulation.
   */
  public opponentTrainingLoop(): void {

    while (!this._finishedSession) {
      this.train();
      this._gameWorld.update();
    }

    Mouse.reset();
  }

  /**
   * Starts a new training session by initializing the AI, setting up the game world, and beginning simulation.
   *
   * @param {GameWorld} gameWorld - The initial state of the game world to start the training session.
   */
  public startSession(gameWorld: GameWorld): void {
    this._soundOnState = GameConfig.soundOn;
    GameConfig.soundOn = false;
    if (gameWorld.isBallInHand) {
      this.placeBallInHand(gameWorld);
    }
    this._initialGameWorld = gameWorld;
    this._gameWorld = cloneDeep(gameWorld);
    this.init();
    this._finishedSession = false;

    this.simulate();
    this.opponentTrainingLoop();
  }
}

// Export a single instance of the AITrainer class for use in the game
export const AI = new AITrainer();
