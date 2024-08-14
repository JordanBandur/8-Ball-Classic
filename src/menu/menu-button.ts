import { IInputConfig, ICursorConfig, IVector2 } from './../game.config.type';
import { IMenuCommand } from './commands/menu-command';
import { GameConfig } from '../game.config';
import { Mouse } from '../input/mouse';
import { Canvas2D } from '../canvas';
import { Assets } from '../assets';
import { IAssetsConfig } from '../game.config.type';

//------Configurations------//

// Load necessary configurations from GameConfig
const inputConfig: IInputConfig = GameConfig.input;
const cursorConfig: ICursorConfig = GameConfig.cursor;
const sprites: IAssetsConfig = GameConfig.sprites;

/**
 * MenuButton
 *
 * This class represents a button in the game's menu. It handles user interactions,
 * such as hovering and clicking, and executes a command when clicked.
 */
export class MenuButton {

  //------Members------//

  private _activeSprite: HTMLImageElement;  // The current sprite image for the button (normal or hovered state)
  private _hovered: boolean;  // Indicates whether the button is currently hovered by the mouse

  //------Properties------//

  /**
   * Sets the hovered state of the button and updates the sprite accordingly.
   *
   * @param value - Boolean indicating whether the button is hovered.
   */
  private set hovered(value: boolean) {
    this._hovered = value;
  }

  //------Constructor------//

  /**
   * Constructs an instance of the MenuButton class.
   *
   * @param _command - The command to execute when the button is clicked.
   * @param _value - The value to pass to the command when executed.
   * @param _position - The position of the button on the canvas.
   * @param _spriteKey - The key for the sprite image in its normal state.
   * @param _spriteOnHoverKey - The key for the sprite image when hovered.
   */
  constructor(
    private _command: IMenuCommand,
    private _value: any,
    private _position: IVector2,
    private _spriteKey: string,
    private _spriteOnHoverKey: string,
  ) {
    console.log("Button Sprite Key (key):", this._spriteKey);
    console.log("Button Sprite Path (value):", sprites.paths[this._spriteKey]);
    console.log("Button Hover Sprite Key (key):", this._spriteOnHoverKey);
    console.log("Button Hover Sprite Path (value):", sprites.paths[this._spriteOnHoverKey]);

    if (!sprites.paths[this._spriteKey]) {
      throw new Error(`Sprite not found for key: ${this._spriteKey}`);
    }

    this._activeSprite = Assets.getSprite(sprites.paths[this._spriteKey]);
  }

  //------Private Methods------//

  /**
   * Checks if the given position is inside the button's boundaries.
   *
   * @param position - The position to check.
   * @returns {boolean} True if the position is inside the button, false otherwise.
   */
  private isInsideButton(position: IVector2): boolean {
    return position.x > this._position.x &&
      position.x < this._position.x + this._activeSprite.width &&
      position.y > this._position.y &&
      position.y < this._position.y + this._activeSprite.height;
  }

  //------Public Methods------//

  /**
   * Handles the user input, checking if the button is hovered or clicked,
   * and executes the associated command if the button is clicked.
   */
  public handleInput(): void {

    this.hovered = this.isInsideButton(Mouse.position);
    this._activeSprite = this._hovered ?
      Assets.getSprite(sprites.paths[this._spriteOnHoverKey]) :
      Assets.getSprite(sprites.paths[this._spriteKey]);

    if (this._hovered && Mouse.isPressed(inputConfig.mouseSelectButton)) {
      Canvas2D.changeCursor(cursorConfig.default);
      this._command.execute(this._value);
    }
  }

  /**
   * Updates the button state based on user input.
   */
  public update(): void {
    this.handleInput();
  }

  /**
   * Draws the button on the canvas, changing the cursor appearance if hovered.
   */
  public draw(): void {
    if (this._hovered) {
      Canvas2D.changeCursor(cursorConfig.button);
    }
    Canvas2D.drawImage(this._activeSprite, this._position);
  }
}
