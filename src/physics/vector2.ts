import { IVector2 } from '../game.config.type';

/**
 * Vector2
 *
 * This class represents a 2D vector, providing a variety of methods for vector
 * arithmetic and operations commonly used in game development, such as addition,
 * subtraction, multiplication, and dot product. The class implements the `IVector2`
 * interface, ensuring consistency with the game's configuration types.
 */
export class Vector2 implements IVector2 {

  //------Members------//

  private _x: number; // The x-coordinate of the vector
  private _y: number; // The y-coordinate of the vector

  //------Constructor------//

  /**
   * Constructor to initialize the vector with given x and y coordinates.
   *
   * @param {number} x - The x-coordinate of the vector.
   * @param {number} y - The y-coordinate of the vector.
   */
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  //------Properties------//

  /**
   * Getter for the x-coordinate of the vector.
   *
   * @returns {number} The x-coordinate.
   */
  get x() {
    return this._x;
  }

  /**
   * Getter for the y-coordinate of the vector.
   *
   * @returns {number} The y-coordinate.
   */
  get y() {
    return this._y;
  }

  /**
   * Static property to return a vector with both coordinates set to zero.
   *
   * @returns {Vector2} A new vector (0, 0).
   */
  static get zero() {
    return new Vector2(0, 0);
  }

  /**
   * Property to calculate and return the length (magnitude) of the vector.
   *
   * @returns {number} The length of the vector.
   */
  get length(): number {
    return Math.sqrt(Math.pow(this._x, 2) + Math.pow(this._y, 2));
  }

  //------Public Methods------//

  /**
   * Static method to create a copy of an existing vector.
   *
   * @param {IVector2} vector - The vector to copy.
   * @returns {Vector2} A new Vector2 instance with the same coordinates as the input vector.
   */
  public static copy(vector: IVector2) {
    return new Vector2(vector.x, vector.y);
  }

  /**
   * Adds a value to the x-coordinate and returns a new Vector2 instance.
   *
   * @param {number} x - The value to add to the x-coordinate.
   * @returns {Vector2} A new vector with the updated x-coordinate.
   */
  public addX(x: number): Vector2 {
    return new Vector2(this._x, this._y).addToX(x);
  }

  /**
   * Adds a value to the y-coordinate and returns a new Vector2 instance.
   *
   * @param {number} y - The value to add to the y-coordinate.
   * @returns {Vector2} A new vector with the updated y-coordinate.
   */
  public addY(y: number): Vector2 {
    return new Vector2(this._x, this._y).addToY(y);
  }

  /**
   * Adds a value to the x-coordinate of the current vector and returns the modified vector.
   *
   * @param {number} x - The value to add to the x-coordinate.
   * @returns {Vector2} The current vector with the updated x-coordinate.
   */
  public addToX(x: number): Vector2 {
    this._x += x;
    return this;
  }

  /**
   * Adds a value to the y-coordinate of the current vector and returns the modified vector.
   *
   * @param {number} y - The value to add to the y-coordinate.
   * @returns {Vector2} The current vector with the updated y-coordinate.
   */
  public addToY(y: number): Vector2 {
    this._y += y;
    return this;
  }

  /**
   * Adds another vector to the current vector and returns the modified vector.
   *
   * @param {Vector2} vector - The vector to add.
   * @returns {Vector2} The current vector after adding the input vector.
   */
  public addTo(vector: Vector2): Vector2 {
    return this.addToX(vector.x).addToY(vector.y);
  }

  /**
   * Adds another vector to the current vector and returns a new Vector2 instance with the result.
   *
   * @param {Vector2} vector - The vector to add.
   * @returns {Vector2} A new vector with the sum of the two vectors.
   */
  public add(vector: Vector2): Vector2 {
    return new Vector2(this._x, this._y).addTo(vector);
  }

  /**
   * Subtracts another vector from the current vector and returns the modified vector.
   *
   * @param {Vector2} vector - The vector to subtract.
   * @returns {Vector2} The current vector after subtracting the input vector.
   */
  public subtractTo(vector: Vector2): Vector2 {
    this._x -= vector.x;
    this._y -= vector.y;
    return this;
  }

  /**
   * Subtracts another vector from the current vector and returns a new Vector2 instance with the result.
   *
   * @param {Vector2} vector - The vector to subtract.
   * @returns {Vector2} A new vector with the difference of the two vectors.
   */
  public subtract(vector: Vector2): Vector2 {
    return new Vector2(this._x, this._y).subtractTo(vector);
  }

  /**
   * Multiplies the current vector by a scalar value and returns a new Vector2 instance with the result.
   *
   * @param {number} v - The scalar value to multiply by.
   * @returns {Vector2} A new vector with the scaled coordinates.
   */
  public mult(v: number): Vector2 {
    return new Vector2(this._x, this._y).multBy(v);
  }

  /**
   * Multiplies the current vector by a scalar value and returns the modified vector.
   *
   * @param {number} v - The scalar value to multiply by.
   * @returns {Vector2} The current vector with the scaled coordinates.
   */
  public multBy(v: number): Vector2 {
    this._x *= v;
    this._y *= v;
    return this;
  }

  /**
   * Calculates the dot product of the current vector with another vector.
   * =
   * @param {Vector2} vector - The vector to calculate the dot product with.
   * @returns {number} The dot product of the two vectors.
   */
  public dot(vector: Vector2): number {
    return this._x * vector.x + this._y * vector.y;
  }

  /**
   * Calculates the distance from the current vector to another vector.
   *
   * @param {Vector2} vector - The vector to calculate the distance to.
   * @returns {number} The distance between the two vectors.
   */
  public distFrom(vector: Vector2): number {
    return this.subtract(vector).length;
  }
}
