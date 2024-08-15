import { IMenuConfig, IButton, ILabel, ICursorConfig, IAssetsConfig } from './../game.config.type';
import { IMenuCommand } from './commands/menu-command';
import { MenuButton } from './menu-button';
import { Assets } from '../assets';
import { Canvas2D } from '../canvas';
import { GameConfig } from '../game.config';
import { MenuActionType } from './menu-action-type';
import { MenuLabel } from './menu-label';

//------Configurations------//

// Load necessary configurations from GameConfig
const cursorConfig: ICursorConfig = GameConfig.cursor;
const sprites: IAssetsConfig = GameConfig.sprites;

/**
 * Menu
 *
 * This class represents a menu in the game. It handles the rendering of menu labels and buttons,
 * as well as the initialization of submenus. The Menu class manages user interaction with buttons
 * and allows navigation through different menu levels.
 */
export class Menu {

  //------Members------//

  private _labels: MenuLabel[];      // Array of labels displayed on the menu
  private _buttons: MenuButton[];    // Array of buttons on the menu
  private _active: boolean;          // Indicates if the menu is currently active
  private _subMenus: Menu[];         // Array of submenus associated with this menu

  //------Properties------//

  /**
   * Sets the active state of the menu.
   *
   * @param value - Boolean indicating whether the menu should be active.
   */
  public set active(value: boolean) {
    this._active = value;
  }

  /**
   * Gets the active state of the menu.
   *
   * @returns {boolean} True if the menu is active, false otherwise.
   */
  public get active(): boolean {
    return this._active;
  }

  //------Public Methods------//

  /**
   * Initializes the menu with buttons, labels, and submenus based on the provided configuration.
   * It maps the actions to their corresponding commands and sets up the menu elements.
   *
   * @param actionsMap - A map linking menu actions to their corresponding commands.
   * @param config - The configuration object defining the menu structure and content.
   */
  public init(actionsMap: Map<MenuActionType, IMenuCommand>, config: IMenuConfig): void {
    // Initialize buttons based on the configuration
    this._buttons = config.buttons.map((button: IButton) => {
      const command = actionsMap.get(button.action);
      if (!command) {
        throw new Error(`Command not found for action: ${button.action}`);
      }

      const sprite = button.sprite;
      const spriteOnHover = button.spriteOnHover;

      return new MenuButton(
        command,
        button.value,
        button.position,
        sprite,
        spriteOnHover,
      );
    });

    // Initialize labels based on the configuration
    this._labels = config.labels.map((label: ILabel) => {
      return new MenuLabel(
        label.text ?? '', // Provide a default empty string if undefined
        label.position,
        label.font,
        label.color,
        label.alignment
      );
    });

    // Initialize submenus recursively based on the configuration
    this._subMenus = config.subMenus.map((menu: IMenuConfig) => {
      const subMenu = new Menu();
      subMenu.init(actionsMap, menu);
      return subMenu;
    });
  }

  /**
   * Retrieves a submenu by its index in the submenu array.
   *
   * @param index - The index of the submenu to retrieve.
   * @returns {Menu} The submenu at the specified index.
   */
  public getSubMenu(index: number): Menu {
    return this._subMenus[index];
  }

  /**
   * Updates the menu state, processing input and updating buttons and submenus.
   * This method should be called on every frame to keep the menu responsive.
   */
  public update(): void {
    if (this._active) {
      this._buttons.forEach((button: MenuButton) => button.update());
    }

    this._subMenus.forEach((menu: Menu) => menu.update());
  }

  /**
   * Draws the menu on the canvas, including the background, labels, buttons, and submenus.
   * This method should be called on every frame to render the menu's visual elements.
   */
  public draw(): void {
    if (this._active) {
      const menuBackgroundSprite = Assets.getSprite(sprites.paths.menuBackground);
      if (!menuBackgroundSprite) {
        throw new Error("Menu background sprite not found!");
      }
      Canvas2D.changeCursor(cursorConfig.default);
      Canvas2D.drawImage(menuBackgroundSprite);
      this._labels.forEach((label: MenuLabel) => label.draw());
      this._buttons.forEach((button: MenuButton) => button.draw());
    }
    this._subMenus.forEach((menu: Menu) => menu.draw());
  }
}
