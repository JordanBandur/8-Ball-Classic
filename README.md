# Classic 8-Ball Pool Game

Welcome to the Classic 8-Ball Pool Game! This project is a digital 2D version of the popular 8-ball pool game, complete with Player vs Player (PVP) and Player vs Computer (PVC) modes. The game features realistic physics, and AI opponents.

## Table of Contents

- [Installation](#installation)
- [Gameplay](#gameplay)
- [Features](#features)
- [Configuration](#configuration)
- [License](#license)

## Installation

To get started with the Classic 8-Ball Pool Game, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone git@github.com:JordanBandur/8-Ball-Classic.git
   cd classic-8ball-pool-game
   ```
2. **Install dependencies:**

    Ensure you have Node.js installed. Then, install the necessary dependencies using pnpm:
    ```bash
    pnpm install
    ```
3. **Run the game:**
    ```bash
    pnpm start
    ```

## Gameplay

### Controls

- **Mouse**: Use the mouse to aim and control the cue stick.
- **W/S Keys**: Increase/decrease the power of your shot.
- **Mouse Click**: Shoot the cue ball.

### Modes

- **Player vs Player (PVP)**: Two players can compete against each other on the same device.
- **Player vs Computer (PVC)**: Play against an AI opponent with adjustable difficulty.

## Features

- **Realistic Physics**: The game simulates real-world physics for ball movement and collisions.
- **AI Opponent**: Compete against an AI with different difficulty levels.
- **Menu System**: Navigate through the game menus to start matches, configure settings, and more.
- **Sound Effects**: Enjoy immersive sound effects that enhance the gaming experience.

## Configuration

The game is highly configurable. You can adjust settings for the game world, physics, AI, and more. The configuration is managed through the `game.config.ts` file. Here are some key settings:

- **Game Size**: Set the dimensions of the game area.
- **Sound**: Toggle sound effects on or off.
- **AI Settings**: Adjust the AI behavior, including training iterations and difficulty.

### Example Configuration

```typescript
export const GameConfig: IGameConfig = {
  gameSize: { x: 1500, y: 825 },
  soundOn: true,
  ai: {
    on: true,
    trainIterations: 30,
    playerIndex: 1,
    // Additional AI settings...
  },
  // Other configurations...
};
```
## Screenshots

Include some screenshots of your game here to showcase its features and design.

![Screenshot 1](https://github.com/JordanBandur/8-Ball-Classic/blob/main/dist/screenshots/main-menu.png)
![Screenshot 2](https://github.com/JordanBandur/8-Ball-Classic/blob/main/dist/screenshots/loading.png)
![Screenshot 3](https://github.com/JordanBandur/8-Ball-Classic/blob/main/dist/screenshots/game-1.png)
![Screenshot 3](https://github.com/JordanBandur/8-Ball-Classic/blob/main/dist/screenshots/game-3.png)

## Credits

 **Building JavaScript Games by Arjan Egges (Apress, 2014):**

[GitHub Repository](https://github.com/apress/building-javascript-games)


**Music:**

  "Bossa Antigua" by Kevin MacLeod (incompetech.com)
  Licensed under Creative Commons: By Attribution 3.0 License
  [http://creativecommons.org/licenses/by/3.0/](http://creativecommons.org/licenses/by/3.0/)


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
