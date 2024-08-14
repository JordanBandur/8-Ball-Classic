import { IVector2 } from './../game.config.type';
import { Canvas2D } from '../canvas';

/**
 * MenuLabel
 *
 * This class represents a label in the game's menu. It is responsible for rendering
 * text on the canvas at a specified position, with a particular font, color, and alignment.
 */
export class MenuLabel {

  //------Constructor------//

  /**
   * Constructs an instance of the MenuLabel class.
   *
   * @param _text - The text content of the label.
   * @param _position - The position of the label on the canvas.
   * @param _font - The font style and size of the text.
   * @param _color - The color of the text.
   * @param _alignment - The alignment of the text (e.g., 'left', 'center', 'right').
   */
  constructor(
    private _text: string,
    private _position: IVector2,
    private _font: string,
    private _color: string,
    private _alignment: string,
  ) { }

  //------Public Methods------//

  /**
   * Draws the label on the canvas using the provided text, font, color, position, and alignment.
   * This method utilizes the Canvas2D utility to render the text.
   */
  public draw(): void {
    Canvas2D.drawText(this._text ?? '', this._font, this._color, this._position, this._alignment);
  }
}
