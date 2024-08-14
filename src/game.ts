import { AI } from './ai/ai-trainer';
import { GoToPreviousMenuCommand } from './menu/commands/go-to-previous-menu-command';
import { GoToSubMenuCommand } from './menu/commands/go-to-sub-menu-command';
import { ToggleSoundCommand } from './menu/commands/toggle-sound-command';
import { PVCCommand } from './menu/commands/pvc-command';
import { PVPCommand } from './menu/commands/pvp-command';
import { IMenuCommand } from './menu/commands/menu-command';
import { GameConfig } from './game.config';
import { MenuActionType } from './menu/menu-action-type';
import { Menu } from './menu/menu';
import { Assets } from './assets';
import { GameWorld } from './game-objects/game-world';
import { Keyboard } from './input/keyboard';
import { Canvas2D } from './canvas';
import { Mouse } from './input/mouse';
import { IAssetsConfig, IInputConfig } from './game.config.type';

//------Configurations------//

// Configuration for sprites (images) used in the game
const sprites: IAssetsConfig = GameConfig.sprites;
// Configuration for input controls, such as key bindings
const inputConfig: IInputConfig = GameConfig.input;

/**
 * The Game class encapsulates the entire game, including the main menu,
 * game world, input handling, and game loop. It manages the initialization,
 * updating, drawing, and transition between different game states such as
 * menus and gameplay.
 */
export class Game {

  //------Members------//

  // A map linking menu actions to their corresponding command objects
  private _menuActionsMap: Map<MenuActionType, IMenuCommand>;
  // Stack to keep track of previous menus for easy navigation
  private _previousMenus: Menu[] = [];
  // The current active menu in the game
  private _menu: Menu = new Menu();
  // The main game world where the pool game is played
  private _poolGame: GameWorld;
  // Boolean flag to indicate whether the game is in a loading state
  private _isLoading: boolean;
  // Boolean flag to indicate whether the player is currently in the game
  private _inGame: boolean;

  //------Private Methods------//

  /**
   * Initializes the mapping of menu actions to their respective commands.
   * This is used to determine what happens when a specific menu action is triggered.
   */
  private initMenuActions(): void {
    this._menuActionsMap = new Map<MenuActionType, IMenuCommand>();
    this._menuActionsMap.set(MenuActionType.PVP, new PVPCommand(this)); // Player vs Player command
    this._menuActionsMap.set(MenuActionType.PVC, new PVCCommand(this)); // Player vs Computer command
    this._menuActionsMap.set(MenuActionType.ToggleSound, new ToggleSoundCommand()); // Toggle sound command
    this._menuActionsMap.set(MenuActionType.GoToSubMenu, new GoToSubMenuCommand(this)); // Navigate to sub-menu command
    this._menuActionsMap.set(MenuActionType.GoToPreviousMenu, new GoToPreviousMenuCommand(this)); // Navigate to previous menu command
  }

  /**
   * Initializes the main menu by linking it with the appropriate menu actions.
   * This sets up the main menu to be interactive and functional.
   */
  private initMainMenu(): void {
    this._menu.init(this._menuActionsMap, GameConfig.mainMenu);
  }

  /**
   * Displays a loading screen before the game starts. This method uses a Promise
   * to handle asynchronous operations, ensuring that the game only proceeds once
   * the loading screen has been displayed for the specified duration.
   *
   * @returns {Promise<void>} A promise that resolves after the loading screen is displayed.
   */
  private displayLoadingScreen(): Promise<void> {
    return new Promise((resolve) => {
      this._isLoading = true; // Set the game state to loading
      Canvas2D.clear(); // Clear the canvas
      Canvas2D.drawImage(
        Assets.getSprite(sprites.paths.controls), // Draw the loading screen image
        GameConfig.loadingScreenImagePosition
      );
      setTimeout(() => {
        this._isLoading = false; // Loading complete
        resolve(); // Resolve the promise to proceed with the game
      }, GameConfig.loadingScreenTimeout); // Timeout duration as specified in GameConfig
    });
  }

  /**
   * Handles user input, particularly checking if the menu key (e.g., Escape)
   * has been pressed to toggle the visibility of the game menu during gameplay.
   */
  private handleInput(): void {
    if (this._inGame && Keyboard.isPressed(inputConfig.toggleMenuKey)) { // Check if the game is in progress and the menu key is pressed
      if (this._menu.active) {
        this._menu.active = false; // Hide the menu if it is currently active
      }
      else {
        this.initMainMenu(); // Re-initialize and display the main menu if it was hidden
        this._menu.active = true;
      }
    }
  }

  /**
   * Updates the game state. This method is called on every frame.
   * It processes input, updates the current menu or game world,
   * and resets input states for the next frame.
   */
  private update(): void {
    if (this._isLoading) return; // Skip update if the game is still loading
    this.handleInput(); // Handle user input
    this._menu.active ? this._menu.update() : this._poolGame.update(); // Update either the menu or the game world based on the current state
    Keyboard.reset(); // Reset keyboard input states
    Mouse.reset(); // Reset mouse input states
  }

  /**
   * Renders the game state to the screen. This method is called on every frame
   * after the update. It clears the canvas and draws either the menu or the game world
   * based on the current state.
   */
  private draw(): void {
    if (this._isLoading) return; // Skip drawing if the game is still loading
    if (AI.finishedSession) { // Check if the AI session has finished
      Canvas2D.clear(); // Clear the canvas
      this._menu.active ? this._menu.draw() : this._poolGame.draw(); // Draw either the menu or the game world based on the current state
    }
  }

  /**
   * The main game loop that continuously updates and renders the game.
   * This loop is executed repeatedly using `requestAnimationFrame` to ensure
   * smooth animation and gameplay.
   */
  private gameLoop(): void {
    this.update(); // Update the game state
    this.draw(); // Render the game state
    window.requestAnimationFrame(() => { // Request the next frame to keep the loop going
      this.gameLoop();
    });
  }

  //------Public Methods------//

  /**
   * Initializes the game by loading assets, setting up the menu actions,
   * initializing the main menu, and starting the game loop.
   *
   * @returns {Promise<void>} A promise that resolves when the game initialization is complete.
   */
  public async init(): Promise<void> {
    await Assets.loadGameAssets(); // Load all necessary game assets

    this.initMenuActions(); // Initialize the menu actions
    this.initMainMenu(); // Initialize the main menu
    this._menu.active = true; // Set the main menu as the active menu
    this._poolGame = new GameWorld(); // Create a new game world instance
    this.gameLoop(); // Start the game loop
  }

  /**
   * Transitions to a sub-menu based on the provided index.
   * It deactivates the current menu, saves it in the history stack, and activates the sub-menu.
   *
   * @param {number} index - The index of the sub-menu to navigate to.
   */
  public goToSubMenu(index: number): void {
    setTimeout(() => { // Delay to simulate loading time
      if (this._menu) {
        this._menu.active = false; // Deactivate the current menu
        this._previousMenus.push(this._menu); // Save the current menu in the history stack
      }
      this._menu = this._menu.getSubMenu(index); // Get the sub-menu by index
      this._menu.active = true; // Activate the sub-menu
    }, GameConfig.timeoutToLoadSubMenu); // Use the configured delay time
  }

  /**
   * Navigates back to the previous menu. This method is used to allow users
   * to backtrack through the menu history stack.
   */
  public goToPreviousMenu(): void {
    if (this._previousMenus.length > 0) { // Check if there are previous menus to go back to
      setTimeout(() => { // Delay to simulate loading time
        this._menu.active = false; // Deactivate the current menu
        this._menu = this._previousMenus.pop(); // Pop the last menu from the history stack and activate it
        this._menu.active = true; // Activate the previous menu
      }, GameConfig.timeoutToLoadSubMenu); // Use the configured delay time
    }
  }

  /**
   * Starts the actual pool game after the loading screen is displayed.
   * It initializes the game world and begins the gameplay.
   */
  public start(): void {
    this.displayLoadingScreen().then(() => { // Display the loading screen before starting
      this._menu.active = false; // Deactivate the menu
      this._inGame = true; // Set the game state to "in-game"
      this._poolGame = new GameWorld(); // Create a new game world instance
      this._poolGame.initMatch(); // Initialize the pool match in the game world
    });
  }
}

// Create an instance of the Game class and initialize it
const game = new Game();
game.init();
