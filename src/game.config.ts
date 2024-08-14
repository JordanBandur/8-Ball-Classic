/**
 * GameConfig
 *
 * This file defines the configuration settings for a billiards game.
 * It includes parameters for various aspects of the game, such as the game area size, sound settings,
 * timeouts for different actions, label settings, positions of the balls, sprite and sound paths,
 * physics configurations, table and ball settings, input controls, main menu and sub-menu configurations,
 * cursor settings, and AI behavior. These settings control the appearance, behavior, and user interaction
 * within the game, making it customizable and flexible.
 */

import { MenuActionType } from './menu/menu-action-type';
import { IGameConfig } from './game.config.type';

export const GameConfig: IGameConfig = {

  // The dimensions of the game window in pixels (width x height)
  gameSize: { x: 1500, y: 825 },

  // Flag to determine if the game sound effects are enabled (true = sound on, false = sound off)
  soundOn: true,

  // The delay (in milliseconds) after a shot is made before the stick is hidden
  timeoutToHideStickAfterShot: 500,

  // The delay (in milliseconds) after a ball is pocketed before the ball is hidden
  timeoutToHideBallAfterPocket: 100,

  // The duration (in milliseconds) for which the loading screen is displayed before the game starts
  loadingScreenTimeout: 5000,

  // The position (x, y coordinates) where the loading screen image should be displayed
  loadingScreenImagePosition: { x: 450, y: 112.5 },

  // The delay (in milliseconds) for loading sub-menus within the game
  timeoutToLoadSubMenu: 100,

  // Configuration for various text labels displayed in the game, such as the current player and overall scores
  labels: {
    // Label for displaying the current player's turn
    currentPlayer: {
      position: { x: 640, y: 260 }, // Position on the screen (x, y coordinates)
      color: '#126736',             // Text color in hexadecimal format
      font: '70px Impact',          // Font style and size
      alignment: 'top',             // Alignment of the text relative to the position
      text: 'PLAYER ',              // Text content (the actual player number is appended dynamically)
    },
    // Labels for displaying the overall scores for both players
    overalScores: [
      {
        position: { x: 628, y: 460 }, // Position for Player 1's score
        color: '#126736',              // Text color
        font: '200px Impact',          // Font style and size
        alignment: 'top'               // Alignment of the text
      },
      {
        position: { x: 778, y: 460 }, // Position for Player 2's score
        color: '#126736',              // Text color
        font: '200px Impact',          // Font style and size
        alignment: 'top'               // Alignment of the text
      }
    ]
  },

  // Predefined positions of the red balls on the table (7 positions)
  redBallsPositions: [
    { x: 1056, y: 433 },
    { x: 1090, y: 374 },
    { x: 1126, y: 393 },
    { x: 1126, y: 472 },
    { x: 1162, y: 335 },
    { x: 1162, y: 374 },
    { x: 1162, y: 452 },
  ],

  // Predefined positions of the yellow balls on the table (7 positions)
  yellowBallsPositions: [
    { x: 1022, y: 413 },
    { x: 1056, y: 393 },
    { x: 1090, y: 452 },
    { x: 1126, y: 354 },
    { x: 1126, y: 433 },
    { x: 1162, y: 413 },
    { x: 1162, y: 491 },
  ],

  // Initial position of the cue ball when the game starts
  cueBallPosition: { x: 413, y: 413 },

  // Initial position of the eight ball when the game starts
  eightBallPosition: { x: 1090, y: 413 },

  // Configuration for the match score display, including the positions of the score digits and spacing between them
  matchScore: {
    scoresPositions: [
      { x: 420, y: 27 }, // Position for Player 1's match score
      { x: 932, y: 27 }  // Position for Player 2's match score
    ],
    unitMargin: 20 // Margin between score digits to allow for visual separation
  },

  // Configuration for the sprite images used in the game, including the base path and specific file names
  sprites: {
    basePath: 'assets/sprites/', // Base directory where all sprite images are stored
    paths: {
      menuBackground: 'main_menu_background.png',  // Background image for the main menu
      table: 'spr_background4.png',                // Image for the pool table background
      cueBall: 'spr_ball2.png',                    // Image for the cue ball
      redBall: 'spr_redBall2.png',                 // Image for the red ball
      yellowBall: 'spr_yellowBall2.png',           // Image for the yellow ball
      blackBall: 'spr_blackBall2.png',             // Image for the black ball (eight ball)
      stick: 'spr_stick.png',                      // Image for the cue stick
      twoPlayersButton: '2_players_button.png',    // Image for the 2 players button in the menu
      twoPlayersButtonHovered: '2_players_button_hover.png', // Image for the 2 players button when hovered
      onePlayerButton: '1_player_button.png',      // Image for the 1 player button in the menu
      onePlayerButtonHovered: '1_player_button_hover.png', // Image for the 1 player button when hovered
      muteButton: 'mute_button.png',               // Image for the mute button
      muteButtonHovered: 'mute_button_hover.png',  // Image for the mute button when hovered
      muteButtonPressed: 'mute_button_pressed.png', // Image for the mute button when pressed
      muteButtonPressedHovered: 'mute_button_pressed_hover.png', // Image for the mute button when pressed and hovered
      easyButton: 'easy_button.png',               // Image for the easy difficulty button
      easyButtonHovered: 'easy_button_hover.png',  // Image for the easy difficulty button when hovered
      mediumButton: 'medium_button.png',           // Image for the medium difficulty button
      mediumButtonHovered: 'medium_button_hover.png', // Image for the medium difficulty button when hovered
      hardButton: 'hard_button.png',               // Image for the hard difficulty button
      hardButtonHovered: 'hard_button_hover.png',  // Image for the hard difficulty button when hovered
      backButton: 'back_button.png',               // Image for the back button in sub-menus
      backButtonHovered: 'back_button_hover.png',  // Image for the back button when hovered
      continueButton: 'continue_button.png',       // Image for the continue button
      continueButtonHovered: 'continue_button_hover.png', // Image for the continue button when hovered
      insaneButton: 'insane_button.png',           // Image for the insane difficulty button
      insaneButtonHovered: 'insane_button_hover.png', // Image for the insane difficulty button when hovered
      controls: 'controls.png',                    // Image for the controls button
      redScore: 'red_score.png',                   // Image for displaying the score for red balls
      yellowScore: 'yellow_score.png'              // Image for displaying the score for yellow balls
    }
  },

  // Configuration for sound assets, including the base path and specific file names for different sound effects
  sounds: {
    basePath: 'assets/sounds/', // Base directory where all sound files are stored
    paths: {
      ballsCollide: 'BallsCollide.wav', // Sound effect for when balls collide
      strike: 'Strike.wav',             // Sound effect for when the cue strikes the cue ball
      rail: 'Hole.wav',                 // Sound effect for when a ball hits the rail or is pocketed
    }
  },

  // Physics settings, including friction and energy loss during collisions, that affect ball movement
  physics: {
    friction: 0.018,       // Coefficient of friction affecting the ball's movement across the table
    collisionLoss: 0.018,  // Energy loss coefficient when balls collide, affecting the post-collision velocity
  },

  // Table settings, including the width of the cushions and the radius of the pockets
  table: {
    cushionWidth: 57,  // Width of the cushions surrounding the table, affecting ball deflection
    pocketRadius: 48,  // Radius of the pockets, determining how easily balls can be pocketed
    pocketsPositions: [ // Positions of the six pockets on the table (four corners and two sides)
      { x: 62, y: 62 },     // Top-left corner pocket
      { x: 750, y: 32 },    // Top-center side pocket
      { x: 1435, y: 62 },   // Top-right corner pocket
      { x: 62, y: 762 },    // Bottom-left corner pocket
      { x: 750, y: 794 },   // Bottom-center side pocket
      { x: 1435, y: 762 }   // Bottom-right corner pocket
    ]
  },

  // Ball settings, including diameter, origin point, and velocity-related properties
  ball: {
    diameter: 38,           // Diameter of each ball in pixels
    origin: { x: 25, y: 25 }, // Origin point for rendering the ball sprite (center of the ball)
    minVelocityLength: 0.05, // Minimum velocity length below which the ball is considered stationary
    maxExpectedVelocity: 120, // Maximum expected velocity of a ball, used for normalizing velocities
    maxExpectedCollisionForce: 70 // Maximum expected collision force, used for sound and visual effects
  },

  // Stick settings, including origin points, power increments, and maximum power for shots
  stick: {
    origin: { x: 970, y: 11 }, // Origin point for rendering the stick sprite
    shotOrigin: { x: 950, y: 11 }, // Origin point for calculating shot direction
    powerToAddPerFrame: 1,     // Amount of power added per frame when charging a shot
    movementPerFrame: 3,       // Amount of movement per frame when adjusting the stick's angle
    maxPower: 50               // Maximum power that can be applied to a shot
  },

  // Input settings, mapping mouse buttons and keys to specific actions in the game
  input: {
    mouseSelectButton: 0,    // Mouse button used to select options (0 = left button)
    mouseShootButton: 0,     // Mouse button used to shoot (0 = left button)
    mousePlaceBallButton: 0, // Mouse button used to place the ball (0 = left button)
    increaseShotPowerKey: 87, // Keyboard key to increase shot power (87 = W key)
    decreaseShotPowerKey: 83, // Keyboard key to decrease shot power (83 = S key)
    toggleMenuKey: 27        // Keyboard key to toggle the game menu (27 = Escape key)
  },

  // Main menu settings, including labels, buttons, and sub-menu configurations
  mainMenu: {

    // Labels displayed in the main menu, such as the game title and copyright notice
    labels: [
      {
        text: 'Classic 8-Ball',         // Title of the game
        position: { x: 200, y: 100 },   // Position on the screen
        font: '100px Bookman',          // Font style and size
        color: 'white',                 // Text color
        alignment: 'left',              // Alignment of the text relative to the position
      },
      {
        text: `© ${new Date().getFullYear()} Jordan Bandur`, // Dynamic copyright notice
        position: { x: 1250, y: 800 }, // Position on the screen
        font: '20px Bookman',           // Font style and size
        color: 'white',                 // Text color
        alignment: 'left',              // Alignment of the text relative to the position
      }
    ],

    // Buttons available in the main menu, including actions and hover states
    buttons: [
      {
        action: MenuActionType.PVP,            // Action for starting a player-vs-player game
        position: { x: 200, y: 200 },          // Position on the screen
        sprite: 'twoPlayersButton',            // Sprite image for the button
        spriteOnHover: 'twoPlayersButtonHovered', // Sprite image when the button is hovered
      },
      {
        action: MenuActionType.GoToSubMenu,    // Action for navigating to a sub-menu
        value: 0,                              // Sub-menu index or ID
        position: { x: 200, y: 400 },          // Position on the screen
        sprite: 'onePlayerButton',             // Sprite image for the button
        spriteOnHover: 'onePlayerButtonHovered', // Sprite image when the button is hovered
      },
      {
        action: MenuActionType.ToggleSound,    // Action for toggling sound on/off
        position: { x: 1430, y: 10 },          // Position on the screen
        sprite: 'muteButton',                  // Sprite image for the button
        spriteOnHover: 'muteButtonHovered',    // Sprite image when the button is hovered
      },
    ],

    // Sub-menu settings within the main menu, including labels and buttons
    subMenus: [
      {
        labels: [
          {
            text: 'Choose Difficulty',       // Title of the sub-menu
            position: { x: 200, y: 80 },     // Position on the screen
            font: '70px Bookman',            // Font style and size
            color: 'white',                  // Text color
            alignment: 'left',               // Alignment of the text relative to the position
          },
          {
            text: `© ${new Date().getFullYear()} Jordan Bandur`, // Dynamic copyright notice
            position: { x: 1250, y: 800 }, // Position on the screen
            font: '20px Bookman',           // Font style and size
            color: 'white',                 // Text color
            alignment: 'left',              // Alignment of the text relative to the position
          }
        ],

        // Buttons available in the sub-menu, including actions, values, and hover states
        buttons: [
          {
            action: MenuActionType.GoToPreviousMenu, // Action to go back to the previous menu
            position: { x: 100, y: 150 },            // Position on the screen
            sprite: 'backButton',                    // Sprite image for the button
            spriteOnHover: 'backButtonHovered',      // Sprite image when the button is hovered
          },
          {
            action: MenuActionType.PVC,              // Action for starting a player-vs-computer game
            position: { x: 200, y: 150 },            // Position on the screen
            value: 30,                               // Difficulty level (easy)
            sprite: 'easyButton',                    // Sprite image for the button
            spriteOnHover: 'easyButtonHovered'       // Sprite image when the button is hovered
          },
          {
            action: MenuActionType.PVC,              // Action for starting a player-vs-computer game
            position: { x: 200, y: 300 },            // Position on the screen
            value: 50,                               // Difficulty level (medium)
            sprite: 'mediumButton',                  // Sprite image for the button
            spriteOnHover: 'mediumButtonHovered'     // Sprite image when the button is hovered
          },
          {
            action: MenuActionType.PVC,              // Action for starting a player-vs-computer game
            position: { x: 200, y: 450 },            // Position on the screen
            value: 100,                              // Difficulty level (hard)
            sprite: 'hardButton',                    // Sprite image for the button
            spriteOnHover: 'hardButtonHovered'       // Sprite image when the button is hovered
          },
          {
            action: MenuActionType.PVC,              // Action for starting a player-vs-computer game
            position: { x: 200, y: 600 },            // Position on the screen
            value: 700,                              // Difficulty level (insane)
            sprite: 'insaneButton',                  // Sprite image for the button
            spriteOnHover: 'insaneButtonHovered'     // Sprite image when the button is hovered
          },
          {
            action: MenuActionType.ToggleSound,      // Action for toggling sound on/off
            position: { x: 1430, y: 10 },            // Position on the screen
            sprite: 'muteButton',                    // Sprite image for the button
            spriteOnHover: 'muteButtonHovered',      // Sprite image when the button is hovered
          },
        ],

        // Nested sub-menus within this sub-menu (empty array if no further sub-menus exist)
        subMenus: []
      }
    ]
  },

  // Cursor settings, defining the cursor appearance for different interactions
  cursor: {
    default: 'default',   // Default cursor appearance (typically an arrow)
    button: 'pointer'     // Cursor appearance when hovering over buttons (typically a hand icon)
  },

  // AI (Artificial Intelligence) settings for the computer opponent, including behavior and bonuses/penalties
  ai: {
    on: true,                      // Flag to enable or disable AI
    trainIterations: 30,           // Number of iterations for training the AI (higher = more complex AI)
    playerIndex: 1,                // Index representing the AI player
    ballDistanceBonus: 1 / 5800,   // Bonus for AI based on proximity of the ball to the target
    validTurnBonus: 5000,          // Bonus for AI when it makes a valid turn
    pocketedBallBonus: 2000,       // Bonus for AI when it pockets a ball
    invalidTurnPenalty: 3000,      // Penalty for AI when it makes an invalid turn
    gameWonBonus: 50000,           // Bonus for AI when it wins a game
    gameLossPenalty: 50000,        // Penalty for AI when it loses a game
    shotPowerMutationVariance: 15, // Variance in shot power to introduce randomness in AI behavior
    minShotPower: 10,              // Minimum shot power the AI can apply
  },
};
