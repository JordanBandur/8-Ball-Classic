import { GameConfig } from './../../game.config';
import { IMenuCommand } from './menu-command';
import { Game } from '../../game';

/**
 * PVCCommand
 *
 * This class implements the `IMenuCommand` interface and is responsible for configuring
 * and starting a Player vs Computer (PVC) match in the game. When the `execute` method is
 * called, it sets up the AI configurations and begins the game.
 */
export class PVCCommand implements IMenuCommand {

  //------Constructor------//

  /**
   * Constructs an instance of the PVCCommand class.
   *
   * @param _game - The instance of the Game class that this command will operate on.
   */
  constructor(private _game: Game) { }

  //------Public Methods------//

  /**
   * Executes the command to start a Player vs Computer match.
   * This method configures the AI settings, including the number of training iterations
   * and randomly assigns the AI to a player index before starting the game.
   *
   * @param iterationsValue - The number of training iterations the AI should perform.
   */
  public execute(iterationsValue: number): void {
    // Randomly assign the AI to be either player 0 or player 1
    GameConfig.ai.playerIndex = Math.floor(Math.random() * 2);

    // Enable the AI
    GameConfig.ai.on = true;

    // Set the number of training iterations for the AI
    GameConfig.ai.trainIterations = iterationsValue;

    // Start the game
    this._game.start();
  }
}
