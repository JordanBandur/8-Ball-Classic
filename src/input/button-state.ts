/**
 * ButtonState
 *
 * This class represents the state of a button, such as a key on the keyboard or a mouse button.
 * It tracks whether the button is currently being held down and whether it was pressed in the
 * current frame. This is useful for handling input in games where both continuous and discrete
 * button actions need to be recognized.
 */
export class ButtonState {

  //------Properties------//

  /**
   * Indicates whether the button is currently being held down.
   *
   * @type {boolean}
   * @default false
   */
  public down = false;

  /**
   * Indicates whether the button was pressed in the current frame.
   *
   * @type {boolean}
   * @default false
   */
  public pressed = false;

}
