import { ButtonState } from './button-state';
import { Canvas2D } from '../canvas';
import { Vector2 } from '../physics/vector2';

/**
 * Mouse_Singleton
 *
 * This class manages the state of mouse inputs in a game. It tracks the position
 * of the mouse cursor on the canvas and the state of mouse buttons (whether they are
 * currently held down or were just pressed). The class follows the singleton pattern,
 * ensuring that only one instance handles all mouse input throughout the game.
 */
class Mouse_Singleton {

  //------Members------//

  /**
   * An array that stores the state of the mouse buttons.
   * Each index corresponds to a mouse button (0 = left, 1 = middle, 2 = right),
   * and the value is a ButtonState object that tracks whether the button is down or pressed.
   *
   * @type {ButtonState[]}
   */
  private _buttonStates: ButtonState[] = [];

  /**
   * The current position of the mouse cursor on the canvas.
   *
   * @type {Vector2}
   */
  private _position: Vector2;

  //------Properties------//

  /**
   * Getter for the mouse cursor position. The position is returned as a copy
   * to ensure that the original position vector is not inadvertently modified.
   *
   * @returns {Vector2} A copy of the current mouse position.
   */
  public get position() {
    return Vector2.copy(this._position);
  }

  //------Constructor------//

  /**
   * Constructor initializes the _buttonStates array to store the state of mouse buttons
   * and sets up event listeners for mouse movement and button events.
   */
  constructor() {

    // Initialize the state for the three mouse buttons (left, middle, right)
    for (let i = 0; i < 3; i++) {
      this._buttonStates[i] = new ButtonState();
    }

    // Initialize the mouse position to (0, 0)
    this._position = Vector2.zero;

    // Listen for mousemove events and handle them
    document.addEventListener('mousemove', (event) => this.handleMouseMove(event));
    // Listen for mousedown events and handle them
    document.addEventListener('mousedown', (event) => this.handleMouseDown(event));
    // Listen for mouseup events and handle them
    document.addEventListener('mouseup', (event) => this.handleMouseUp(event));
  }

  //------Private Methods------//

  /**
   * Handles the 'mousemove' event, updating the mouse cursor position
   * based on the event coordinates, adjusted for canvas scale and offset.
   *
   * @param {MouseEvent} event - The mouse event triggered when the mouse is moved.
   */
  private handleMouseMove(event: MouseEvent): void {
    // Calculate the mouse position relative to the canvas, adjusted for scale and offset
    const mouseX: number = (event.pageX - Canvas2D.offsetX) / Canvas2D.scaleX;
    const mouseY: number = (event.pageY - Canvas2D.offsetY) / Canvas2D.scaleY;
    this._position = new Vector2(mouseX, mouseY); // Update the mouse position
  }

  /**
   * Handles the 'mousedown' event, updating the state of the pressed mouse button
   * to indicate that it is currently held down and was just pressed.
   *
   * @param {MouseEvent} event - The mouse event triggered when a button is pressed.
   */
  private handleMouseDown(event: MouseEvent) {
    this._buttonStates[event.button].down = true;
    this._buttonStates[event.button].pressed = true;
  }

  /**
   * Handles the 'mouseup' event, updating the state of the released mouse button
   * to indicate that it is no longer held down.
   *
   * @param {MouseEvent} event - The mouse event triggered when a button is released.
   */
  private handleMouseUp(event: MouseEvent) {
    this._buttonStates[event.button].down = false;
  }

  //------Public Methods------//

  /**
   * Resets the 'pressed' state of all mouse buttons. This method should be called at the end
   * of each frame to ensure that mouse buttons are only registered as 'pressed' for a single frame.
   */
  public reset(): void {
    for (let i = 0; i < 3; i++) {
      this._buttonStates[i].pressed = false;
    }
  }

  /**
   * Checks whether a specific mouse button is currently held down.
   *
   * @param {number} button - The button index to check (0 = left, 1 = middle, 2 = right).
   * @returns {boolean} True if the button is currently held down, false otherwise.
   */
  public isDown(button: number): boolean {
    return this._buttonStates[button].down;
  }

  /**
   * Checks whether a specific mouse button was pressed in the current frame.
   *
   * @param {number} button - The button index to check (0 = left, 1 = middle, 2 = right).
   * @returns {boolean} True if the button was pressed in the current frame, false otherwise.
   */
  public isPressed(button: number): boolean {
    return this._buttonStates[button].pressed;
  }
}

// Export a single instance of the Mouse_Singleton class for use throughout the game
export const Mouse = new Mouse_Singleton();
