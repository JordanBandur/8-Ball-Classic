import { MenuActionType } from './menu/menu-action-type';

/**
 * IGameConfig
 *
 * This interface defines the overall configuration for the billiards game.
 * It includes various properties to control the game's behavior, appearance,
 * and interaction, such as game dimensions, sound settings, timeouts, labels,
 * ball positions, sprites, physics, table and ball characteristics, user input,
 * main menu structure, cursor behavior, and AI settings.
 */
export interface IGameConfig {
  gameSize: IVector2;                      // Dimensions of the game window (width x height)
  soundOn: boolean;                        // Flag to indicate if sound is enabled
  timeoutToHideStickAfterShot: number;     // Delay before hiding the cue stick after a shot (ms)
  timeoutToHideBallAfterPocket: number;    // Delay before hiding the ball after it is pocketed (ms)
  loadingScreenTimeout: number;            // Duration of the loading screen (ms)
  timeoutToLoadSubMenu: number;            // Delay for loading sub-menus (ms)
  loadingScreenImagePosition: IVector2;    // Position of the loading screen image (x, y coordinates)
  labels: ILabelsConfig;                   // Configuration for various text labels displayed in the game
  redBallsPositions: IVector2[];           // Positions of red balls on the table (array of x, y coordinates)
  yellowBallsPositions: IVector2[];        // Positions of yellow balls on the table (array of x, y coordinates)
  cueBallPosition: IVector2;               // Initial position of the cue ball (x, y coordinates)
  eightBallPosition: IVector2;             // Initial position of the eight ball (x, y coordinates)
  matchScore: IMatchScoreConfig;           // Configuration for displaying match scores
  sprites: IAssetsConfig;                  // Configuration for sprite assets (images)
  sounds: IAssetsConfig;                   // Configuration for sound assets (audio files)
  physics: IPhysicsConfig;                 // Configuration for game physics, such as friction and collision loss
  table: ITableConfig;                     // Configuration for the pool table, including cushion width and pocket radius
  ball: IBallConfig;                       // Configuration for ball properties, such as diameter and velocity
  stick: IStickConfig;                     // Configuration for the cue stick, including origin and power settings
  input: IInputConfig;                     // Configuration for user input controls, such as key bindings
  mainMenu: IMenuConfig;                   // Configuration for the main menu structure and sub-menus
  cursor: ICursorConfig;                   // Configuration for cursor behavior, such as default and button states
  ai: IAIConfig;                           // Configuration for AI behavior and settings
}

/**
 * IVector2
 *
 * Interface to represent a 2D vector or position with x and y coordinates.
 * This is commonly used to define positions and sizes in the game.
 */
export interface IVector2 {
  x: number; // X-coordinate
  y: number; // Y-coordinate
}

/**
 * ILabelsConfig
 *
 * Interface for configuring the labels used in the game, such as the current player's label
 * and the overall scores. Labels include text content, position, font, color, and alignment.
 */
export interface ILabelsConfig {
  currentPlayer: ILabel;      // Label for displaying the current player's turn
  overalScores: ILabel[];     // Array of labels for displaying overall scores of players
}

/**
 * IMatchScoreConfig
 *
 * Interface for configuring how match scores are displayed in the game, including the positions
 * of the score digits and the margin between them.
 */
export interface IMatchScoreConfig {
  scoresPositions: IVector2[]; // Positions of the score digits (array of x, y coordinates)
  unitMargin: number;          // Margin between score digits for spacing
}

/**
 * IAssetsConfig
 *
 * Interface for configuring assets used in the game, such as sprites (images) or sounds.
 * It includes a base path for the assets and a dictionary of paths for specific assets.
 */
export interface IAssetsConfig {
  basePath: string;             // Base directory path for the assets
  paths: { [key: string]: string; }; // Dictionary of asset paths (key = asset name, value = file path)
}

/**
 * IPhysicsConfig
 *
 * Interface for configuring the physics properties in the game, such as friction and
 * collision loss, which affect how objects move and interact.
 */
export interface IPhysicsConfig {
  friction: number;       // Coefficient of friction affecting ball movement
  collisionLoss: number;  // Energy loss during collisions affecting post-collision velocities
}

/**
 * ITableConfig
 *
 * Interface for configuring the pool table properties, including cushion width, pocket radius,
 * and the positions of the pockets.
 */
export interface ITableConfig {
  cushionWidth: number;      // Width of the cushions surrounding the table
  pocketRadius: number;      // Radius of the pockets where balls can be pocketed
  pocketsPositions: IVector2[]; // Positions of the pockets (array of x, y coordinates)
}

/**
 * IBallConfig
 *
 * Interface for configuring the properties of the balls in the game, such as their diameter,
 * origin, and velocity parameters.
 */
export interface IBallConfig {
  diameter: number;              // Diameter of the balls
  origin: IVector2;              // Origin point for rendering the ball sprite (typically the center)
  minVelocityLength: number;     // Minimum velocity below which the ball is considered stationary
  maxExpectedVelocity: number;   // Maximum expected velocity used for normalizing speeds
  maxExpectedCollisionForce: number; // Maximum expected collision force used for visual and sound effects
}

/**
 * IStickConfig
 *
 * Interface for configuring the properties of the cue stick, including its origin, power settings,
 * and movement behavior.
 */
export interface IStickConfig {
  origin: IVector2;               // Origin point for rendering the stick sprite
  shotOrigin: IVector2;           // Origin point for calculating shot direction
  powerToAddPerFrame: number;     // Amount of power added per frame when charging a shot
  movementPerFrame: number;       // Amount of movement per frame when adjusting the stick's angle
  maxPower: number;               // Maximum power that can be applied to a shot
}

/**
 * IInputConfig
 *
 * Interface for configuring user input controls, including mouse button actions and key bindings
 * for various in-game actions like shooting, placing the ball, and toggling the menu.
 */
export interface IInputConfig {
  mouseSelectButton: number;      // Mouse button for selecting options (0 = left button)
  mouseShootButton: number;       // Mouse button for shooting (0 = left button)
  mousePlaceBallButton: number;   // Mouse button for placing the ball (0 = left button)
  increaseShotPowerKey: number;   // Key binding to increase shot power (e.g., W key)
  decreaseShotPowerKey: number;   // Key binding to decrease shot power (e.g., S key)
  toggleMenuKey: number;          // Key binding to toggle the game menu (e.g., Escape key)
}

/**
 * IMenuConfig
 *
 * Interface for configuring the main menu and sub-menus in the game. This includes labels,
 * buttons, and the structure of sub-menus, allowing for nested menu configurations.
 */
export interface IMenuConfig {
  labels: ILabel[];           // Array of labels displayed in the menu
  buttons: IButton[];         // Array of buttons in the menu, each linked to a specific action
  subMenus: IMenuConfig[];    // Array of sub-menu configurations for creating nested menus
}

/**
 * IButton
 *
 * Interface for configuring buttons in the menus, including their action, position, and
 * sprite images for normal and hover states. An optional value can be assigned for additional
 * behavior (e.g., difficulty level).
 */
export interface IButton {
  action: MenuActionType;     // Action to be triggered when the button is pressed
  position: IVector2;         // Position of the button on the screen (x, y coordinates)
  sprite: string;             // Sprite image for the button in its normal state
  spriteOnHover: string;      // Sprite image for the button when it is hovered over
  value?: number;             // Optional value associated with the button (e.g., difficulty level)
}

/**
 * ILabel
 *
 * Interface for configuring labels in the game, which are used for displaying text such as
 * player names, scores, and instructions. It includes position, font, color, alignment, and
 * optional text content.
 */
export interface ILabel {
  position: IVector2;         // Position of the label on the screen (x, y coordinates)
  font: string;               // Font style and size for the label text
  color: string;              // Color of the label text
  alignment: string;          // Alignment of the text relative to the position (e.g., left, center, right)
  text?: string;              // Optional text content to be displayed by the label
}

/**
 * ICursorConfig
 *
 * Interface for configuring the appearance of the cursor during different interactions in the game.
 * It includes default and button-specific cursor states.
 */
export interface ICursorConfig {
  default: string;            // Default cursor appearance (e.g., arrow)
  button: string;             // Cursor appearance when hovering over buttons (e.g., pointer/hand)
}

/**
 * IAIConfig
 *
 * Interface for configuring the AI (Artificial Intelligence) behavior in the game. This includes
 * various settings that determine how the AI player behaves, such as training iterations, bonuses,
 * penalties, and shot power settings.
 */
export interface IAIConfig {
  on: boolean;                     // Flag to enable or disable AI
  trainIterations: number;         // Number of training iterations for AI behavior
  playerIndex: number;             // Index representing the AI player
  ballDistanceBonus: number;       // Bonus for AI based on proximity of the ball to the target
  validTurnBonus: number;          // Bonus for AI when it makes a valid turn
  pocketedBallBonus: number;       // Bonus for AI when it pockets a ball
  invalidTurnPenalty: number;      // Penalty for AI when it makes an invalid turn
  gameWonBonus: number;            // Bonus for AI when it wins a game
  gameLossPenalty: number;         // Penalty for AI when it loses a game
  shotPowerMutationVariance: number; // Variance in shot power to introduce randomness in AI behavior
  minShotPower: number;            // Minimum shot power the AI can apply
}
