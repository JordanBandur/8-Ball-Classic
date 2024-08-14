/**
 * MenuActionType
 *
 * This enum defines the different types of actions that can be triggered from
 * the game menu. These actions correspond to various commands that control the
 * game flow, such as starting different game modes, toggling sound, or navigating
 * between menus.
 */
export enum MenuActionType {
  /**
   * CONTINUE
   *
   * Action to continue the game from a paused state or return to the main game screen.
   * This is typically used when resuming a game that has been paused.
   */
  CONTINUE,

  /**
   * PVP (Player vs Player)
   *
   * Action to start a Player vs Player game mode, where two human players compete against each other.
   */
  PVP,

  /**
   * PVC (Player vs Computer)
   *
   * Action to start a Player vs Computer game mode, where a human player competes against an AI opponent.
   */
  PVC,

  /**
   * ToggleSound
   *
   * Action to toggle the sound on or off. This is used to mute or unmute the game audio.
   */
  ToggleSound,

  /**
   * GoToSubMenu
   *
   * Action to navigate to a sub-menu. This is used when a menu option leads to another menu with more options.
   */
  GoToSubMenu,

  /**
   * GoToPreviousMenu
   *
   * Action to navigate back to the previous menu. This is typically used for a "Back" button to return to the previous menu screen.
   */
  GoToPreviousMenu
}
