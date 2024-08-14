import { GameConfig } from './game.config';
import { IAssetsConfig } from './game.config.type';

//------Configurations------//

// Configuration for sprite assets (images) used in the game
const sprites: IAssetsConfig = GameConfig.sprites;
// Configuration for sound assets (audio files) used in the game
const sounds: IAssetsConfig = GameConfig.sounds;

/**
 * Assets_Singleton
 *
 * This class is responsible for managing the loading, storage, and retrieval of
 * game assets such as sprites (images) and sounds (audio files). It follows the
 * singleton pattern, ensuring that only one instance of the class is used throughout
 * the game. The class provides methods for loading assets asynchronously, retrieving
 * them for use in the game, and playing sounds with the appropriate volume settings.
 */
class Assets_Singleton {

  //------Members------//

  private _sprites: Map<string, HTMLImageElement>; // Map to store loaded sprite images
  private _sounds: Map<string, HTMLAudioElement>;  // Map to store loaded audio elements

  //------Constructor------//

  /**
   * Constructor initializes the maps for sprites and sounds, which will store
   * the loaded assets for quick retrieval during gameplay.
   */
  constructor() {
    this._sprites = new Map<string, HTMLImageElement>();
    this._sounds = new Map<string, HTMLAudioElement>();
  }

  //------Private Methods------//

  /**
   * Loads a single sprite (image) and stores it in the _sprites map.
   * The method returns a promise that resolves when the image is fully loaded.
   *
   * @param {string} path - The path to the sprite image file.
   * @returns {Promise<void>} A promise that resolves when the sprite is loaded.
   */
  private loadSprite(path: string): Promise<void> {
    const img = new Image();
    this._sprites.set(path, img);

    return new Promise(resolve => {
      img.onload = () => resolve(); // Resolve the promise when the image is loaded
      img.src = sprites.basePath + path; // Set the source of the image to start loading
    });
  }

  /**
   * Asynchronously loads all game sprites defined in the GameConfig.
   * This method maps over all sprite paths and triggers their loading, returning
   * a promise that resolves when all sprites are loaded.
   *
   * @returns {Promise<void>} A promise that resolves when all sprites are loaded.
   */
  private async loadGameSprites(): Promise<void> {
    const loadPromises = Object.values(sprites.paths).map(this.loadSprite.bind(this));
    await Promise.all(loadPromises); // Wait until all sprite loading promises are resolved
  }

  /**
   * Loads a single sound (audio file) and stores it in the _sounds map.
   * The method returns a promise that resolves when the audio file is fully loaded.
   *
   * @param {string} path - The path to the sound file.
   * @returns {Promise<void>} A promise that resolves when the sound is loaded.
   */
  private loadSound(path: string): Promise<void> {
    const audio: HTMLAudioElement = new Audio(sounds.basePath + path);
    this._sounds.set(path, audio);
    audio.load(); // Start loading the audio file

    return new Promise(resolve => {
      audio.onloadeddata = () => resolve(); // Resolve the promise when the audio file is loaded
    });
  }

  /**
   * Asynchronously loads all game sounds defined in the GameConfig.
   * This method maps over all sound paths and triggers their loading, returning
   * a promise that resolves when all sounds are loaded.
   *
   * @returns {Promise<void>} A promise that resolves when all sounds are loaded.
   */
  private async loadGameSounds(): Promise<void> {
    const loadPromises = Object.values(sounds.paths).map(this.loadSound.bind(this));
    await Promise.all(loadPromises); // Wait until all sound loading promises are resolved
  }

  //------Public Methods------//

  /**
   * Asynchronously loads all game assets, including sprites and sounds.
   * This method calls the private methods to load both sprites and sounds,
   * ensuring that all assets are available before the game starts.
   *
   * @returns {Promise<void>} A promise that resolves when all assets are loaded.
   */
  public async loadGameAssets(): Promise<void> {
    await this.loadGameSounds();  // Load all game sounds
    await this.loadGameSprites(); // Load all game sprites
  }

  /**
   * Retrieves a loaded sprite (image) by its key from the _sprites map.
   *
   * @param {string} key - The key corresponding to the desired sprite.
   * @returns {HTMLImageElement} The image element associated with the key.
   */
  public getSprite(key: string): HTMLImageElement {
    return this._sprites.get(key);
  }

  /**
   * Retrieves a loaded sound (audio file) by its key from the _sounds map.
   * The method returns a cloned instance of the audio element to allow for
   * multiple sound plays simultaneously.
   *
   * @param {string} key - The key corresponding to the desired sound.
   * @returns {HTMLAudioElement} A clone of the audio element associated with the key.
   */
  public getSound(key: string): HTMLAudioElement {
    return this._sounds.get(key).cloneNode(true) as HTMLAudioElement;
  }

  /**
   * Plays a sound by its key at a specified volume. The sound is only played
   * if the soundOn flag in GameConfig is set to true. The method retrieves
   * the sound, sets its volume, and plays it.
   *
   * @param {string} key - The key corresponding to the sound to play.
   * @param {number} volume - The volume level to play the sound at (0.0 to 1.0).
   */
  public playSound(key: string, volume: number): void {
    if (GameConfig.soundOn) { // Check if sound is enabled in the game configuration
      const sound = this.getSound(key); // Retrieve the sound by its key
      sound.volume = volume;            // Set the desired volume level
      sound.play();                     // Play the sound
    }
  }
}

// Export a single instance of the Assets_Singleton class for use throughout the game
export const Assets = new Assets_Singleton();
