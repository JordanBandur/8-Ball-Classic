import { Color } from '../common/color';

/**
 * Player
 *
 * This class represents a player in the game. It tracks the player's assigned ball color,
 * match score, and overall score. The `Player` class is a simple data structure that holds
 * the essential information needed to manage a player's state during the game.
 */
export class Player {

  //------Properties------//

  /**
   * The color assigned to the player, representing the type of balls they are playing with
   * (e.g., red, yellow, black, white). This can be null if the player has not been assigned a color yet.
   *
   * @type {Color | null}
   * @default null
   */
  public color: Color | null = null;

  /**
   * The score for the current match. This value tracks the player's performance in the current game session.
   *
   * @type {number}
   * @default 0
   */
  public matchScore: number = 0;

  /**
   * The player's overall score, which could represent the cumulative score across multiple games or sessions.
   *
   * @type {number}
   * @default 0
   */
  public overallScore: number = 0;

}
