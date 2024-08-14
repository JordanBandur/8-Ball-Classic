import { GameConfig } from './../game.config';
import { GameWorld } from './../game-objects/game-world';

/**
 * AIPolicy
 *
 * This class represents the policy used by the AI to evaluate game states during gameplay.
 * It calculates a score based on the positions of the balls, the validity of the turn,
 * and whether the game is over. The evaluation score helps the AI decide on its strategy
 * by quantifying how favorable the current game state is.
 */
export class AIPolicy {

  /**
   * Constructs an instance of the AIPolicy class.
   *
   * The constructor does not take any parameters and is used to initialize the class instance.
   */
  constructor() { }

  /**
   * Evaluates the current game state based on the positions of the balls, the validity of the turn,
   * and the game outcome. The evaluation score is influenced by AI configuration parameters
   * defined in the game configuration.
   *
   * @param {GameWorld} gameWorld - The current state of the game world, including the positions of the balls and the turn's validity.
   * @returns {number} The evaluation score representing how favorable the current game state is for the AI.
   */
  public evaluate(gameWorld: GameWorld): number {

    let evaluation: number = 1; // Start with a base evaluation score

    // Evaluate the distance between each pair of balls on the table
    for (let i = 0; i < gameWorld.balls.length; i++) {
      for (let j = i + 1; j < gameWorld.balls.length; j++) {

        let firstBall = gameWorld.balls[i];
        let secondBall = gameWorld.balls[j];

        // Increase evaluation score based on the distance between balls
        evaluation += firstBall.position.distFrom(secondBall.position) * GameConfig.ai.ballDistanceBonus;
      }
    }

    // Add bonuses if the turn is valid
    if (gameWorld.isTurnValid) {
      evaluation += GameConfig.ai.validTurnBonus; // Bonus for a valid turn
      evaluation += GameConfig.ai.pocketedBallBonus * gameWorld.numOfPocketedBallsOnTurn; // Bonus for each pocketed ball

      // Additional bonus if the game is won
      if (gameWorld.isGameOver) {
        evaluation += GameConfig.ai.gameWonBonus;
      }
    }
    // Apply penalties if the turn is invalid
    else {
      evaluation -= GameConfig.ai.invalidTurnPenalty; // Penalty for an invalid turn

      // Additional penalty if the game is lost
      if (gameWorld.isGameOver) {
        evaluation -= GameConfig.ai.gameLossPenalty;
      }
    }

    return evaluation; // Return the final evaluation score
  }
}
