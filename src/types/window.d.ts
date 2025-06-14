
/**
 * @file Define the type of the global window object.
 * @module types/window
 */
interface Window {
  /**
   * Asteroids game class.
   * @type {any}
   */
  Asteroids: any;
   /**
   * Asteroids game player array.
   * @type {any[]}
   */
  ASTEROIDSPLAYERS: any[];
  /**
   * Function to initialize the Live2D widget.
   * @type {(config: Config) => void}
   */
  initWidget: (config: Config) => void;
  /*
   * Function to change the tool in the ToolsManager.
   */
  changeTool: (instance: ToolsManager , index: number, new_tool: any) => void;
  /*
   * Function to show a message.
   * @param {string | string[]} text - Message text or array of texts.
   * @param {number} timeout - Timeout for message display (ms).
   * @param {number} priority - Priority of the message.
   * @param {boolean} [override=true] - Whether to override existing message.
   */
  showMessage: (message: string, timeout?: number, priority?: number, override?: boolean) => void;
}
