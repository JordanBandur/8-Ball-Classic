import { ButtonState } from './button-state';

/**
 * Keyboard_Singleton
 *
 * This class manages the state of keyboard inputs in a game. It tracks the state of each key,
 * including whether it is currently held down or was just pressed in the current frame. The class
 * follows the singleton pattern, ensuring that only one instance handles all keyboard input throughout
 * the game. It provides methods to check the state of specific keys and to reset the pressed state
 * after each frame.
 */
class Keyboard_Singleton {

  //------Members------//

  /**
   * An array that stores the state of each key on the keyboard.
   * Each index corresponds to a keyCode, and the value is a ButtonState object
   * that tracks whether the key is down or pressed.
   *
   * @type {ButtonState[]}
   */
  private _keyStates: ButtonState[] = [];

  //------Constructor------//

  /**
   * Constructor initializes the _keyStates array to store the state of all keys.
   * It also sets up event listeners for 'keyup' and 'keydown' events to track changes
   * in the keyboard state.
   */
  constructor() {
    // Initialize the state for all keys (assuming a maximum of 256 keys)
    for (let i = 0; i < 256; i++) {
      this._keyStates[i] = new ButtonState();
    }

    // Listen for keyup events and handle them
    document.addEventListener('keyup', (event) => this.handleKeyUp(event));
    // Listen for keydown events and handle them
    document.addEventListener('keydown', (event) => this.handleKeyDown(event));
  }

  //------Private Methods------//

  /**
   * Handles the 'keyup' event, updating the state of the key to indicate it is no longer held down.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered when a key is released.
   */
  private handleKeyUp(event: KeyboardEvent): void {
    this._keyStates[event.keyCode].down = false;
  }

  /**
   * Handles the 'keydown' event, updating the state of the key to indicate it is currently held down
   * and was just pressed.
   *
   * @param {KeyboardEvent} event - The keyboard event triggered when a key is pressed.
   */
  private handleKeyDown(event: KeyboardEvent): void {
    this._keyStates[event.keyCode].pressed = true;
    this._keyStates[event.keyCode].down = true;
  }

  //------Public Methods------//

  /**
   * Resets the 'pressed' state of all keys. This method should be called at the end of each frame
   * to ensure that keys are only registered as 'pressed' for a single frame.
   */
  public reset(): void {
    for (let i = 0; i < 256; i++) {
      this._keyStates[i].pressed = false;
    }
  }

  /**
   * Checks whether a specific key is currently held down.
   *
   * @param {number} keyCode - The keyCode of the key to check.
   * @returns {boolean} True if the key is currently held down, false otherwise.
   */
  public isDown(keyCode: number): boolean {
    return this._keyStates[keyCode].down;
  }

  /**
   * Checks whether a specific key was pressed in the current frame.
   *
   * @param {number} keyCode - The keyCode of the key to check.
   * @returns {boolean} True if the key was pressed in the current frame, false otherwise.
   */
  public isPressed(keyCode: number): boolean {
    return this._keyStates[keyCode].pressed;
  }
}

// Export a single instance of the Keyboard_Singleton class for use throughout the game
export const Keyboard = new Keyboard_Singleton();
