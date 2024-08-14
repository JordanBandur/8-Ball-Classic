import { GameConfig } from './../../game.config';
import { Game } from '../../game';
import { IMenuCommand } from './menu-command';

/**
 * PVPCommand
 *
 * This class implements the `IMenuCommand` interface and is responsible for configuring
 * and starting a Player vs Player (PVP) match in the game. When the `execute` method is
 * called, it disables the AI and begins the game in PVP mode.
 */
export class PVPCommand implements IMenuCommand {

  //------Constructor------//

  /**
   * Constructs an instance of the PVPCommand class.
   *
   * @param _game - The instance of the Game class that this command will operate on.
   */
  constructor(private _game: Game) { }

  //------Public Methods------//

  /**
   * Executes the command to start a Player vs Player match.
   * This method disables the AI by setting the relevant configuration in GameConfig
   * and then starts the game.
   */
  public execute(): void {
    // Disable the AI for a Player vs Player match
    GameConfig.ai.on = false;

    // Start the game
    this._game.start();
  }

}
