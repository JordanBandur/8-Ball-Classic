import { IMenuCommand } from './menu-command';
import { Game } from '../../game';

/**
 * GoToPreviousMenuCommand
 *
 * This class implements the `IMenuCommand` interface and provides the functionality to navigate
 * back to the previous menu in the game. When the `execute` method is called, the game will return
 * to the last menu that was active.
 */
export class GoToPreviousMenuCommand implements IMenuCommand {

  //------Constructor------//

  /**
   * Constructs an instance of the GoToPreviousMenuCommand class.
   *
   * @param _game - The instance of the Game class that this command will operate on.
   */
  constructor(private _game: Game) { }

  //------Public Methods------//

  /**
   * Executes the command to navigate back to the previous menu in the game.
   * This method triggers the `goToPreviousMenu` method in the Game class.
   */
  public execute(): void {
    this._game.goToPreviousMenu();
  }

}
