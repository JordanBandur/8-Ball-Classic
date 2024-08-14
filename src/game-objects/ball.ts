import { IBallConfig, IPhysicsConfig, IAssetsConfig } from './../game.config.type';
import { GameConfig } from '../game.config';
import { Canvas2D } from '../canvas';
import { Color } from '../common/color';
import { Vector2 } from '../physics/vector2';
import { Assets } from '../assets';

// Load configurations from the game configuration
const physicsConfig: IPhysicsConfig = GameConfig.physics;
const sprites: IAssetsConfig = GameConfig.sprites;
const ballConfig: IBallConfig = GameConfig.ball;

/**
 * Ball
 *
 * This class represents a billiard ball in the game. It handles the ball's position, velocity,
 * movement, visibility, and rendering. The ball's behavior is governed by physics settings
 * such as friction, and it interacts with other game elements based on its color and type.
 */
export class Ball {

  //------Members------//

  private _sprite: HTMLImageElement;  // The image representing the ball
  private _color: Color;              // The color/type of the ball
  private _velocity: Vector2 = Vector2.zero;  // The current velocity of the ball
  private _moving: boolean = false;   // Indicates whether the ball is currently moving
  private _visible: boolean = true;   // Indicates whether the ball is visible on the canvas

  //------Properties------//

  /**
   * Gets the current position of the ball.
   *
   * @returns {Vector2} A copy of the ball's current position.
   */
  public get position(): Vector2 {
    return Vector2.copy(this._position);
  }

  /**
   * Sets the position of the ball.
   *
   * @param {Vector2} value - The new position of the ball.
   */
  public set position(value: Vector2) {
    this._position = value;
  }

  /**
   * Calculates and gets the ball's next position based on its current velocity and the physics friction.
   *
   * @returns {Vector2} The calculated next position of the ball.
   */
  public get nextPosition(): Vector2 {
    return this.position.add(this._velocity.mult(1 - physicsConfig.friction));
  }

  /**
   * Gets the current velocity of the ball.
   *
   * @returns {Vector2} A copy of the ball's current velocity.
   */
  public get velocity(): Vector2 {
    return Vector2.copy(this._velocity);
  }

  /**
   * Sets the velocity of the ball and updates its moving state.
   *
   * @param {Vector2} value - The new velocity of the ball.
   */
  public set velocity(value: Vector2) {
    this._moving = value.length > 0 ? true : false;
    this._velocity = value;
  }

  /**
   * Indicates whether the ball is currently moving.
   *
   * @returns {boolean} True if the ball is moving, false otherwise.
   */
  public get moving(): boolean {
    return this._moving;
  }

  /**
   * Gets the color/type of the ball.
   *
   * @returns {Color} The color/type of the ball.
   */
  public get color(): Color {
    return this._color;
  }

  /**
   * Indicates whether the ball is currently visible on the canvas.
   *
   * @returns {boolean} True if the ball is visible, false otherwise.
   */
  public get visible(): boolean {
    return this._visible;
  }

  //------Constructor------//

  /**
   * Constructor initializes the ball with a position and color. It also resolves
   * the appropriate sprite image based on the ball's color.
   *
   * @param {Vector2} _position - The initial position of the ball.
   * @param {Color} color - The color/type of the ball (e.g., white, black, red, yellow).
   */
  constructor(private _position: Vector2, color: Color) {
    this._color = color;
    this.resolveSprite(color); // Set the appropriate sprite based on the ball's color
  }

  //------Private Methods------//

  /**
   * Resolves the sprite image for the ball based on its color/type.
   * This method assigns the correct sprite to the _sprite member variable.
   *
   * @param {Color} color - The color/type of the ball.
   */
  private resolveSprite(color: Color) {
    switch (color) {
      case Color.white:
        this._sprite = Assets.getSprite(sprites.paths.cueBall);
        break;

      case Color.black:
        this._sprite = Assets.getSprite(sprites.paths.blackBall);
        break;

      case Color.red:
        this._sprite = Assets.getSprite(sprites.paths.redBall);
        break;

      case Color.yellow:
        this._sprite = Assets.getSprite(sprites.paths.yellowBall);
        break;
    }
  }

  //------Public Methods------//

  /**
   * Shoots the ball with a specified power and angle. This sets the ball's velocity
   * based on the given parameters and marks the ball as moving.
   *
   * @param {number} power - The power of the shot, affecting the ball's velocity.
   * @param {number} angle - The angle of the shot in radians, affecting the direction of the ball's velocity.
   */
  public shoot(power: number, angle: number): void {
    this._velocity = new Vector2(power * Math.cos(angle), power * Math.sin(angle));
    this._moving = true;
  }

  /**
   * Makes the ball visible on the canvas at a specified position and stops its movement.
   *
   * @param {Vector2} position - The position where the ball should be displayed.
   */
  public show(position: Vector2): void {
    this._position = position;
    this._velocity = Vector2.zero;
    this._visible = true;
  }

  /**
   * Hides the ball from the canvas and stops its movement.
   */
  public hide(): void {
    this._velocity = Vector2.zero;
    this._moving = false;
    this._visible = false;
  }

  /**
   * Updates the ball's position based on its velocity and the game's physics settings.
   * If the ball's velocity drops below a certain threshold, it stops moving.
   */
  public update(): void {
    if (this._moving) {
      this._velocity.multBy(1 - physicsConfig.friction); // Apply friction to reduce velocity
      this._position.addTo(this._velocity); // Update the ball's position based on its velocity

      if (this._velocity.length < ballConfig.minVelocityLength) {
        this.velocity = Vector2.zero; // Stop the ball if its velocity is too low
        this._moving = false;
      }
    }
  }

  /**
   * Draws the ball on the canvas at its current position if it is visible.
   */
  public draw(): void {
    if (this._visible) {
      Canvas2D.drawImage(this._sprite, this._position, 0, ballConfig.origin);
    }
  }
}
