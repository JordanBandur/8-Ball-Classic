import { State } from './state';
import { Color } from '../common/color';
import { Ball } from "./ball";
import { Player } from "./player";

/**
 * Referee
 *
 * This class handles the logic for determining the validity of a player's actions during their turn
 * in a billiards game. It checks whether the player made a valid first touch, whether the pocketed balls
 * are valid, and whether the game is over. The `Referee` class acts as an authority to enforce the rules
 * of the game.
 */
export class Referee {

  //------Private Methods------//

  /**
   * Determines if the first ball touched by the cue ball is valid according to the game's rules.
   * This method checks if the player hit the correct ball based on their assigned color, match score,
   * and whether any balls were pocketed.
   *
   * @param {Player} player - The player currently taking their turn.
   * @param {Color} collidedBallColor - The color of the first ball that was collided with.
   * @param {boolean} somePocketed - Indicates whether any balls were pocketed during the turn.
   * @returns {boolean} True if the first touch is valid, false otherwise.
   */
  private isValidFirstTouch(player: Player, collidedBallColor: Color, somePocketed: boolean): boolean {

    if (!collidedBallColor) {
      return false; // No valid collision occurred
    }
    if (!player.color) {
      return collidedBallColor !== Color.black; // The player is not yet assigned a color, avoid black ball
    }

    return player.color === collidedBallColor ||
      (player.matchScore === 1 && somePocketed && collidedBallColor !== Color.black) ||
      (player.matchScore === 7 && collidedBallColor === Color.black) ||
      (player.matchScore === 8 && collidedBallColor === Color.black);
  }

  /**
   * Checks whether the pocketed balls during the turn are valid according to the game's rules.
   * This method ensures that the correct balls were pocketed based on the player's color and match score.
   *
   * @param {Player} player - The player currently taking their turn.
   * @param {Ball[]} pocketedBalls - An array of balls that were pocketed during the turn.
   * @returns {boolean} True if all pocketed balls are valid, false otherwise.
   */
  private isValidPocketedBalls(player: Player, pocketedBalls: Ball[]): boolean {
    if (pocketedBalls.length === 0) {
      return true; // No balls were pocketed, so the turn is valid
    }
    if (player.color) {
      if (player.matchScore === 8) {
        return pocketedBalls.length === 1 && pocketedBalls[0].color === Color.black; // Only black ball should be pocketed
      }
      else {
        return pocketedBalls.every((ball: Ball) => ball.color === player.color); // All pocketed balls must match player's color
      }
    } else {
      const color = pocketedBalls[0].color;
      return color !== Color.white &&
        color !== Color.black &&
        pocketedBalls.every((ball: Ball) => ball.color === color); // All pocketed balls should be of the same color (not white or black)
    }
  }

  //------Public Methods------//

  /**
   * Determines if the player's turn is valid by checking both the first touch and the pocketed balls.
   *
   * @param {Player} player - The player currently taking their turn.
   * @param {State} state - The current state of the game, including the first collided ball and pocketed balls.
   * @returns {boolean} True if the turn is valid, false otherwise.
   */
  public isValidTurn(player: Player, state: State): boolean {
    return this.isValidFirstTouch(player, state.firstCollidedBallColor, state.pocketedBalls.length > 0) &&
      this.isValidPocketedBalls(player, state.pocketedBalls);
  }

  /**
   * Determines if the game is over by checking the visibility of the eight ball and the cue ball.
   * The game is considered over if the eight ball is pocketed or if specific conditions related to
   * the player's match score and cue ball visibility are met.
   *
   * @param {Player} currentPlayer - The player currently taking their turn.
   * @param {Ball} cueBall - The cue ball in play.
   * @param {Ball} eightBall - The eight ball in play.
   * @returns {boolean} True if the game is over, false otherwise.
   */
  public isGameOver(currentPlayer: Player, cueBall: Ball, eightBall: Ball): boolean {
    return !eightBall.visible || // Game over if the eight ball is pocketed
      (!cueBall.visible && currentPlayer.matchScore === 7) || // Game over if cue ball is pocketed and player is on the last normal ball
      (!cueBall.visible && currentPlayer.matchScore === 8); // Game over if cue ball is pocketed and player is on the eight ball
  }
}
