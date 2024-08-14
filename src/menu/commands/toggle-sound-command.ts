import { IAssetsConfig } from './../../game.config.type';
import { IMenuCommand } from './menu-command';
import { GameConfig } from '../../game.config';

//------Configurations------//

// Load the sprites configuration from GameConfig
const sprites: IAssetsConfig = GameConfig.sprites;

/**
 * ToggleSoundCommand
 *
 * This class implements the `IMenuCommand` interface and is responsible for toggling
 * the sound on and off in the game. When the `execute` method is called, it changes the
 * sound setting and updates the mute button's appearance accordingly.
 */
export class ToggleSoundCommand implements IMenuCommand {

  //------Private Methods------//

  /**
   * Toggles the mute button's sprite to reflect the current sound state.
   * This method swaps the sprite paths between the pressed and unpressed states.
   */
  private toggleMuteButtonSprite(): void {
    const currentMuteButtonPath: string = sprites.paths.muteButton;
    const currentMuteButtonHoveredPath: string = sprites.paths.muteButtonHovered;

    // Swap the current sprite paths with the pressed sprite paths
    sprites.paths.muteButton = sprites.paths.muteButtonPressed;
    sprites.paths.muteButtonHovered = sprites.paths.muteButtonPressedHovered;
    sprites.paths.muteButtonPressed = currentMuteButtonPath;
    sprites.paths.muteButtonPressedHovered = currentMuteButtonHoveredPath;
  }

  //------Public Methods------//

  /**
   * Executes the command to toggle the game's sound on or off.
   * It updates the GameConfig's sound setting and changes the mute button's appearance.
   */
  public execute(): void {
    // Toggle the sound setting
    GameConfig.soundOn = !GameConfig.soundOn;

    // Update the mute button sprite to reflect the new sound state
    this.toggleMuteButtonSprite();
  }

}
