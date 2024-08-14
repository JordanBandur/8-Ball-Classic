import { IStickConfig, IInputConfig } from './../game.config.type';
import { Keyboard } from '../input/keyboard';
import { Mouse } from '../input/mouse';
import { GameConfig } from '../game.config';
import { Assets } from '../assets';
import { Canvas2D } from '../canvas';
import { Vector2 } from '../physics/vector2';
import { mapRange } from '../common/helper';
import { IAssetsConfig } from '../game.config.type';

//------Configurations------//

// Load configurations from the game configuration
const inputConfig: IInputConfig = GameConfig.input;
const stickConfig: IStickConfig = GameConfig.stick;
const sprites: IAssetsConfig = GameConfig.sprites;
const sounds: IAssetsConfig = GameConfig.sounds;

/**
 * Stick
 *
 * This class represents the cue stick used in the game to shoot the billiard balls.
 * It handles the stick's position, rotation, power, visibility, and movement.
 * The stick's behavior is controlled by player inputs (keyboard and mouse) and
 * interacts with the game world based on configured settings.
 */
export class Stick {

  //------Members------//

  private _sprite: HTMLImageElement = Assets.getSprite(sprites.paths.stick); // The image representing the stick
  private _rotation: number = 0; // The current rotation angle of the stick in radians
  private _origin: Vector2 = Vector2.copy(stickConfig.origin); // The origin point for rotating the stick
  private _power: number = 0; // The current power level of the shot
  private _movable: boolean = true; // Indicates whether the stick can be moved (rotation and power)
  private _visible: boolean = true; // Indicates whether the stick is visible on the canvas

  //------Properties------//

  /**
   * Gets the current position of the stick.
   *
   * @returns {Vector2} A copy of the stick's current position.
   */
  public get position(): Vector2 {
    return Vector2.copy(this._position);
  }

  /**
   * Gets the current rotation angle of the stick in radians.
   *
   * @returns {number} The current rotation angle of the stick.
   */
  public get rotation(): number {
    return this._rotation;
  }

  /**
   * Gets the current power level of the shot.
   *
   * @returns {number} The current power level of the shot.
   */
  public get power(): number {
    return this._power;
  }

  /**
   * Sets whether the stick can be moved (rotation and power).
   *
   * @param {boolean} value - True if the stick can be moved, false otherwise.
   */
  public set movable(value: boolean) {
    this._movable = value;
  }

  /**
   * Gets whether the stick is currently visible on the canvas.
   *
   * @returns {boolean} True if the stick is visible, false otherwise.
   */
  public get visible(): boolean {
    return this._visible;
  }

  /**
   * Sets the visibility of the stick on the canvas.
   *
   * @param {boolean} value - True to make the stick visible, false to hide it.
   */
  public set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Sets the rotation angle of the stick in radians.
   *
   * @param {number} value - The new rotation angle of the stick.
   */
  public set rotation(value: number) {
    this._rotation = value;
  }

  //------Constructor------//

  /**
   * Constructor initializes the stick at a given position. The stick's initial settings
   * are based on the game configuration.
   *
   * @param {Vector2} _position - The initial position of the stick on the canvas.
   */
  constructor(private _position: Vector2) { }

  //------Private Methods------//

  /**
   * Increases the power level of the shot by a configured amount per frame.
   * It also moves the origin point of the stick forward.
   */
  private increasePower(): void {
    this._power += stickConfig.powerToAddPerFrame;
    this._origin.addToX(stickConfig.movementPerFrame);
  }

  /**
   * Decreases the power level of the shot by a configured amount per frame.
   * It also moves the origin point of the stick backward.
   */
  private decreasePower(): void {
    this._power -= stickConfig.powerToAddPerFrame;
    this._origin.addToX(-stickConfig.movementPerFrame);
  }

  /**
   * Checks if the current power level is below the maximum allowed power.
   *
   * @returns {boolean} True if the power is less than the maximum, false otherwise.
   */
  private isLessThanMaxPower(): boolean {
    return this._power < stickConfig.maxPower;
  }

  /**
   * Checks if the current power level is at least the minimum allowed power (i.e., non-negative).
   *
   * @returns {boolean} True if the power is greater than or equal to zero, false otherwise.
   */
  private isMoreThanMinPower(): boolean {
    return this._power >= 0;
  }

  /**
   * Updates the power level of the shot based on player input.
   * The power increases or decreases depending on which keys are pressed.
   */
  private updatePower(): void {

    if (Keyboard.isDown(inputConfig.increaseShotPowerKey) && this.isLessThanMaxPower()) {
      this.increasePower();
    }
    else if (Keyboard.isDown(inputConfig.decreaseShotPowerKey) && this.isMoreThanMinPower()) {
      this.decreasePower();
    }
  }

  /**
   * Updates the rotation angle of the stick based on the current mouse position.
   * The stick rotates to point towards the mouse cursor.
   */
  private updateRotation(): void {
    const opposite: number = Mouse.position.y - this._position.y;
    const adjacent: number = Mouse.position.x - this._position.x;
    this._rotation = Math.atan2(opposite, adjacent); // Calculate the rotation angle using trigonometry
  }

  //------Public Methods------//

  /**
   * Hides the stick, stops its movement, and resets its power to zero.
   * This is typically called after a shot is made.
   */
  public hide(): void {
    this._power = 0;
    this._visible = false;
    this._movable = false;
  }

  /**
   * Shows the stick at a specified position, resets its origin and power,
   * and makes it movable and visible again.
   *
   * @param {Vector2} position - The position where the stick should be shown.
   */
  public show(position: Vector2): void {
    this._position = position;
    this._origin = Vector2.copy(stickConfig.origin);
    this._movable = true;
    this._visible = true;
  }

  /**
   * Simulates the action of shooting the ball by playing the strike sound
   * and adjusting the stick's origin point. The volume of the sound is based on the shot's power.
   */
  public shoot(): void {
    this._origin = Vector2.copy(stickConfig.shotOrigin);
    const volume: number = mapRange(this._power, 0, stickConfig.maxPower, 0, 1);
    Assets.playSound(sounds.paths.strike, volume); // Play the strike sound with appropriate volume
  }

  /**
   * Updates the stick's rotation and power based on player input.
   * This method is called on every frame when the stick is movable.
   */
  public update(): void {
    if (this._movable) {
      this.updateRotation(); // Update the stick's rotation to follow the mouse
      this.updatePower();    // Update the stick's power based on keyboard input
    }
  }

  /**
   * Draws the stick on the canvas at its current position and rotation if it is visible.
   */
  public draw(): void {
    if (this._visible) {
      Canvas2D.drawImage(this._sprite, this._position, this._rotation, this._origin); // Draw the stick on the canvas
    }
  }
}
