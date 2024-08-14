import { IVector2 } from './game.config.type';
import { GameConfig } from './game.config';
import { Vector2 } from './physics/vector2';

/**
 * Canvas2D_Singleton
 *
 * This class is responsible for managing the 2D canvas used in the game.
 * It handles canvas resizing, drawing images and text, clearing the canvas,
 * and changing the cursor style. The class follows the singleton pattern
 * to ensure that only one instance is used throughout the game.
 */
class Canvas2D_Singleton {

  //------Members------//

  private _canvasContainer: HTMLElement; // The HTML container element that wraps the canvas
  private _canvas: HTMLCanvasElement;    // The HTML canvas element where the game is rendered
  private _context: CanvasRenderingContext2D; // The 2D rendering context for drawing on the canvas
  private _scale: Vector2;               // The scaling factor applied to the canvas
  private _offset: Vector2;              // The offset position of the canvas within the container

  //------Properties------//

  /**
   * Getter for the x-axis scaling factor applied to the canvas.
   *
   * @returns {number} The scaling factor along the x-axis.
   */
  public get scaleX() {
    return this._scale.x;
  }

  /**
   * Getter for the y-axis scaling factor applied to the canvas.
   *
   * @returns {number} The scaling factor along the y-axis.
   */
  public get scaleY() {
    return this._scale.y;
  }

  /**
   * Getter for the x-axis offset of the canvas within its container.
   *
   * @returns {number} The x-axis offset of the canvas.
   */
  public get offsetX() {
    return this._offset.x;
  }

  /**
   * Getter for the y-axis offset of the canvas within its container.
   *
   * @returns {number} The y-axis offset of the canvas.
   */
  public get offsetY() {
    return this._offset.y;
  }

  //------Constructor------//

  /**
   * Constructor initializes the canvas and its container, setting up the
   * rendering context and adjusting the canvas size based on the window size.
   *
   * @param {HTMLCanvasElement} canvas - The HTML canvas element used for rendering.
   * @param {HTMLElement} canvasContainer - The HTML element that contains the canvas.
   */
  constructor(canvas: HTMLCanvasElement, canvasContainer: HTMLElement) {
    this._canvasContainer = canvasContainer;
    this._canvas = canvas;
    this._context = this._canvas.getContext('2d');
    this.resizeCanvas(); // Adjust the canvas size when the instance is created
  }

  //------Public Methods------//

  /**
   * Resizes the canvas to fit within the window while maintaining the aspect ratio defined in the game configuration.
   * The method adjusts the canvas size and position, and recalculates the scaling factors.
   */
  public resizeCanvas(): void {

    const originalCanvasWidth = GameConfig.gameSize.x;  // Original width of the game canvas
    const originalCanvasHeight = GameConfig.gameSize.y; // Original height of the game canvas
    const widthToHeight: number = originalCanvasWidth / originalCanvasHeight; // Aspect ratio of the canvas

    let newHeight: number = window.innerHeight; // New height based on window size
    let newWidth: number = window.innerWidth;   // New width based on window size

    const newWidthToHeight: number = newWidth / newHeight; // New aspect ratio based on window size

    if (newWidthToHeight > widthToHeight) {
      newWidth = newHeight * widthToHeight; // Adjust width to maintain aspect ratio
    } else {
      newHeight = newWidth / widthToHeight; // Adjust height to maintain aspect ratio
    }

    // Update the container size and position to center the canvas
    this._canvasContainer.style.width = newWidth + 'px';
    this._canvasContainer.style.height = newHeight + 'px';
    this._canvasContainer.style.marginTop = (window.innerHeight - newHeight) / 2 + 'px';
    this._canvasContainer.style.marginLeft = (window.innerWidth - newWidth) / 2 + 'px';
    this._canvasContainer.style.marginBottom = (window.innerHeight - newHeight) / 2 + 'px';
    this._canvasContainer.style.marginRight = (window.innerWidth - newWidth) / 2 + 'px';

    // Calculate the new scale factors for the canvas
    this._scale = new Vector2(newWidth / originalCanvasWidth, newHeight / originalCanvasHeight);

    // Update the canvas size
    this._canvas.width = newWidth;
    this._canvas.height = newHeight;

    // Update the canvas offset if the canvas has a parent element
    if (this._canvas.offsetParent) {
      this._offset = new Vector2(this._canvas.offsetLeft, this._canvas.offsetTop);
    }
  }

  /**
   * Clears the entire canvas by filling it with a transparent black rectangle,
   * effectively erasing all previous drawings.
   */
  public clear(): void {
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
  }

  /**
   * Draws an image (sprite) on the canvas at a specified position, with an optional rotation
   * and origin point for rotation. The image is scaled according to the canvas scale.
   *
   * @param {HTMLImageElement} sprite - The image element to draw.
   * @param {IVector2} [position={x: 0, y: 0}] - The position to draw the image at (default is (0, 0)).
   * @param {number} [rotation=0] - The rotation angle in radians (default is 0).
   * @param {IVector2} [origin={x: 0, y: 0}] - The origin point for rotation (default is (0, 0)).
   */
  public drawImage(
    sprite: HTMLImageElement,
    position: IVector2 = { x: 0, y: 0 },
    rotation: number = 0,
    origin: IVector2 = { x: 0, y: 0 }
  ) {
    this._context.save(); // Save the current state of the canvas
    this._context.scale(this._scale.x, this._scale.y); // Scale the canvas according to the calculated factors
    this._context.translate(position.x, position.y); // Move the canvas to the desired position
    this._context.rotate(rotation); // Rotate the canvas by the specified angle
    // Draw the image, adjusting for the origin point and scaling
    this._context.drawImage(sprite, 0, 0, sprite.width, sprite.height, -origin.x, -origin.y, sprite.width, sprite.height);
    this._context.restore(); // Restore the canvas to its original state
  }

  /**
   * Draws text on the canvas at a specified position, with a given font, color, and alignment.
   * The text is scaled according to the canvas scale.
   *
   * @param {string} text - The text string to draw.
   * @param {string} font - The font style and size to use for the text.
   * @param {string} color - The color of the text.
   * @param {IVector2} position - The position to draw the text at.
   * @param {string} [textAlign='left'] - The alignment of the text (default is 'left').
   */
  public drawText(text: string, font: string, color: string, position: IVector2, textAlign: string = 'left'): void {
    this._context.save(); // Save the current state of the canvas
    this._context.scale(this._scale.x, this._scale.y); // Scale the canvas according to the calculated factors
    this._context.fillStyle = color; // Set the text color
    this._context.font = font; // Set the font style and size
    this._context.textAlign = textAlign as CanvasTextAlign; // Set the text alignment
    this._context.fillText(text, position.x, position.y); // Draw the text at the specified position
    this._context.restore(); // Restore the canvas to its original state
  }

  /**
   * Changes the cursor style when hovering over the canvas. This is used to provide visual
   * feedback to the player, such as changing the cursor to a pointer when hovering over buttons.
   *
   * @param {string} cursor - The CSS cursor style to apply (e.g., 'pointer', 'default').
   */
  public changeCursor(cursor: string): void {
    this._canvas.style.cursor = cursor;
  }
}

// Create a singleton instance of the Canvas2D_Singleton class
const canvas: HTMLCanvasElement = document.getElementById('screen') as HTMLCanvasElement;
const container: HTMLElement = document.getElementById('gameArea') as HTMLElement;
export const Canvas2D = new Canvas2D_Singleton(canvas, container);

// Add an event listener to resize the canvas when the window is resized
window.addEventListener('resize', Canvas2D.resizeCanvas.bind(Canvas2D));
