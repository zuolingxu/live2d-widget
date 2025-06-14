/**
 * @file Contains classes related to waifu model loading and management.
 * @module model
 */

import {showMessage} from './message.js';
import {loadExternalResource} from './utils.js';
import type Cubism2Model from './cubism2/index.js';
import type {AppDelegate as Cubism5Model} from './cubism5/index.js';
import logger, {LogLevel} from './logger.js';

interface Model {
  name: string;
  paths: string[];
  message: string;
}

interface Config {
  /**
   * Path to the waifu configuration file.
   * @type {string}
   */
  waifuPath: string;
  /**
   * Path to local model
   */
  modelPath?: string;
  /** Path to model setting */
  modelSetting?: string;
  /**
   * Path to Cubism 2 Core
   * @type {string | undefined}
   */
  cubism2Path?: string;
  /**
   * Path to Cubism 5 Core, if you need to load Cubism 3 and later models.
   * @type {string | undefined}
   */
  cubism5Path?: string;
  /**
   * Support for dragging the waifu.
   * @type {boolean | undefined}
   */
  drag?: boolean;
  /**
   * Log level.
   * @type {LogLevel | undefined}
   */
  logLevel?: LogLevel;
}

/**
 * Waifu model class, responsible for loading and managing models.
 */
class ModelManager {
  private readonly cubism2Path: string;
  private readonly cubism5Path: string;
  private modelPath: string;
  private modelSetting: string;
  private modelCurrentMotion: string | undefined;
  private modelCurrentColor: string | undefined;
  private cubism2model: Cubism2Model | undefined;
  private cubism5model: Cubism5Model | undefined;
  private currentModelVersion: number;
  private loading: boolean;
  private modelJSON: Record<string, any>;

  /**
   * Create a Model instance.
   * @param {Config} config - Configuration options
   */
  private constructor(config: Config) {
    const { cubism2Path, cubism5Path } = config;
    this.modelPath = config.modelPath || '';
    if (this.modelPath && !this.modelPath.endsWith('/')) {
      this.modelPath += '/';
    }
    this.modelSetting = config.modelSetting || '';
    this.cubism2Path = cubism2Path || '';
    this.cubism5Path = cubism5Path || '';
    this.currentModelVersion = 0;
    this.loading = false;
    this.modelJSON = {};
  }

  public static async newInstance(config: Config) {
    return new ModelManager(config);
  }

  resetCanvas() {
    document.getElementById('waifu-canvas').innerHTML = '<canvas id="live2d" width="800" height="800"></canvas>';
  }

  async fetchWithCache(jsonPath: string) {
    let result;
    if (jsonPath in this.modelJSON) {
      result = this.modelJSON[jsonPath];
    } else {
      try {
        const response = await fetch(jsonPath);
        result = await response.json();
      } catch {
        result = null;
      }
      this.modelJSON[jsonPath] = result;
    }
    return result;
  }

  checkModelVersion(modelSetting: any) {
    if (modelSetting.Version === 3 || modelSetting.FileReferences) {
      return 3;
    }
    return 2;
  }

  async loadLive2D(modelSettingPath: string, modelSetting: object) {
    logger.info(`loadLive2D start, modelSettingPath: ${modelSettingPath}
    modelSetting: ${JSON.stringify(modelSetting)}`);

    if (this.loading) {
      logger.warn('Still loading. Abort.');
      return;
    }
    this.loading = true;
    try {
      const version = this.checkModelVersion(modelSetting);
      if (version === 2) {
        if (!this.cubism2model) {
          if (!this.cubism2Path) {
            logger.error('No cubism2Path set, cannot load Cubism 2 Core.')
            return;
          }
          await loadExternalResource(this.cubism2Path, 'js');
          const { default: Cubism2Model } = await import('./cubism2/index.js');
          this.cubism2model = new Cubism2Model();
        }
        if (this.currentModelVersion === 3) {
          (this.cubism5model as any).release();
          // Recycle WebGL resources
          this.resetCanvas();
        }
        if (this.currentModelVersion === 3 || !this.cubism2model.gl) {
          await this.cubism2model.init('live2d', modelSettingPath, modelSetting);
        } else {
          await this.cubism2model.changeModelWithJSON(modelSettingPath, modelSetting);
        }
      } else {
        if (!this.cubism5Path) {
          logger.error('No cubism5Path set, cannot load Cubism 5 Core.')
          return;
        }
        await loadExternalResource(this.cubism5Path, 'js');
        const { AppDelegate: Cubism5Model } = await import('./cubism5/index.js');
        this.cubism5model = new (Cubism5Model as any)();
        if (this.currentModelVersion === 2) {
          this.cubism2model.destroy();
          // Recycle WebGL resources
          this.resetCanvas();
        }
        if (this.currentModelVersion === 2 || !this.cubism5model.subdelegates.at(0)) {
          this.cubism5model.initialize();
          this.cubism5model.changeModel(modelSettingPath);
          this.cubism5model.run();
        } else {
          this.cubism5model.changeModel(modelSettingPath);
        }
      }
      logger.info(`Model ${modelSettingPath} (Cubism version ${version}) loaded`);
      this.currentModelVersion = version;
    } catch (err) {
      console.error('loadLive2D failed', err);
    }
    this.loading = false;
  }

  /**
   * Load the specified model.
   * @param {string | string[]} message - Loading message.
   */
  async loadModel(message: string | string[]) {
    logger.info('loadModel start');
    const modelSettingJson = await this.fetchWithCache(this.modelPath + this.modelSetting);
    await this.loadLive2D(this.modelPath, modelSettingJson);
    showMessage(message, 4000, 10);
    logger.info('loadModel end');
  }

  /**
   * Load a random texture for the current model.
   */
  // async loadRandTexture(successMessage: string | string[] = '', failMessage: string | string[] = '') {
  //   const { modelId } = this;
  //   let noTextureAvailable = false;
  //   if (this.models[modelId].paths.length === 1) {
  //     noTextureAvailable = true;
  //   } else {
  //     this.modelTexturesId = randomOtherOption(this.models[modelId].paths.length, this.modelTexturesId);
  //   }
  //
  //   if (noTextureAvailable) {
  //     showMessage(failMessage, 4000, 10);
  //   } else {
  //     await this.loadModel(successMessage);
  //   }
  // }
}

export { ModelManager, Config, Model };
