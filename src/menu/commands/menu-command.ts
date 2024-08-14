/**
 * IMenuCommand
 *
 * This interface defines the structure for menu command classes in the game.
 * Any class that implements this interface must provide an implementation for
 * the `execute` method, which takes a value as an argument and performs a specific action.
 */
export interface IMenuCommand {
  /**
   * Executes the command with the given value.
   *
   * @param value - The value that may influence the command's behavior.
   */
  execute(value: any): void;
}
