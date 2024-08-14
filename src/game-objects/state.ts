import { Ball } from './ball';
import { Color } from "../common/color";

/**
 * State
 *
 * This class represents the state of a player's turn or the current game state in the context of a billiard game.
 * It tracks key events and conditions such as the first ball color that was collided with, any pocketed balls,
 * whether the player has the ball in hand, and whether the current state of play is valid.
 */
export class State {

  //------Properties------//

  /**
   * The color of the first ball that was collided with during the player's turn.
   * This is important for determining whether a foul has occurred or if the player is following the rules.
   *
   * @type {Color}
   */
  public firstCollidedBallColor: Color;

  /**
   * An array of balls that have been pocketed during the player's turn.
   * This is used to track which balls have been sunk and may influence scoring or game rules.
   *
   * @type {Ball[]}
   * @default []
   */
  public pocketedBalls: Ball[] = [];

  /**
   * A flag indicating whether the player has the ball in hand, allowing them to place it anywhere on the table.
   * This typically occurs after certain fouls or at the start of the game.
   *
   * @type {boolean}
   * @default false
   */
  public ballInHand = false;

  /**
   * A flag indicating whether the current state of play is valid according to the game's rules.
   * This can be used to determine if the player's actions during their turn are legitimate or if a foul has occurred.
   *
   * @type {boolean}
   * @default false
   */
  public isValid = false;
}
