/**
 * AIOpponent
 *
 * This class represents an AI-controlled opponent in the game. It stores key attributes
 * that determine the AI's behavior during gameplay, such as the power of its shots,
 * the rotation angle (direction) it aims at, and an evaluation metric that can be used
 * to assess or adjust its performance.
 */
export class AIOpponent {

  /**
   * Constructs an instance of the AIOpponent class with default or provided values.
   *
   * @param {number} power - The power level of the AI's shots. This determines how hard the AI strikes the ball.
   * @param {number} rotation - The rotation angle in radians that the AI uses to aim its shots.
   * @param {number} evaluation - A metric used to evaluate the AI's performance, potentially for adjusting its strategy.
   */
  constructor(
    public power: number = 50,     // Default power level of 50
    public rotation: number = 0,   // Default rotation angle of 0 radians (pointing right)
    public evaluation: number = 0  // Default evaluation metric of 0
  ) { }
}
