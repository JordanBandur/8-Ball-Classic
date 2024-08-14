import { Game } from '../../game';
import { IMenuCommand } from './menu-command';

/**
 * GoToSubMenuCommand
 *
 * This class implements the `IMenuCommand` interface and provides the functionality to navigate
 * to a specified submenu in the game. When the `execute` method is called with a value,
 * the game will load the corresponding submenu.
 */
export class GoToSubMenuCommand implements IMenuCommand {

  //------Constructor------//

  /**
   * Constructs an instance of the GoToSubMenuCommand class.
   *
   * @param _game - The instance of the Game class that this command will operate on.
   */
  constructor(private _game: Game) { }

  //------Public Methods------//

  /**
   * Executes the command to navigate to a specified submenu in the game.
   * This method triggers the `goToSubMenu` method in the Game class with the provided value.
   *
   * @param value - The value indicating which submenu to navigate to.
   */
  public execute(value: any): void {
    this._game.goToSubMenu(value);
  }

}
