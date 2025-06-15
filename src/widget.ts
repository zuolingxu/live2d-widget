/**
 * @file Contains functions for initializing the waifu widget.
 * @module widget
 */

import { ModelManager, Config } from './model.js';
import { ToolsManager } from './tools.js';
import logger from './logger.js';
import registerDrag from './drag.js';
import { fa_child } from './icons.js';


/**
 * Load the waifu widget.
 * @param {Config} config - Waifu configuration.
 */
async function loadWidget(config: Config) {
  localStorage.removeItem('waifu-display');
  sessionStorage.removeItem('waifu-message-priority');
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="waifu">
       <div id="waifu-tips"></div>
       <div id="waifu-canvas">
         <canvas id="live2d" width="800" height="800"></canvas>
       </div>
       <div id="waifu-tool"></div>
     </div>`,
  );

  const model = await ModelManager.newInstance(config);
  await model.loadModel('');
  const tools = new ToolsManager()
  tools.loadTools();

  if (config.drag) registerDrag();
  document.getElementById('waifu')?.classList.add('waifu-active');
  return { 'ModelManager': model,'ToolsManager': tools }
}

/**
 * Initialize the waifu widget.
 * @param {string | Config} config - Waifu configuration or configuration path.
 */
function initWidget(config: Config) {
  let globals;
  if (typeof config === 'string') {
    logger.error('Your config for Live2D initWidget is outdated. Please refer to https://github.com/stevenjoezhang/live2d-widget/blob/master/dist/autoload.js');
    return;
  }
  document.body.insertAdjacentHTML(
    'beforeend',
    `<div id="waifu-toggle">
       ${fa_child}
     </div>`,
  );
  
  const toggle = document.getElementById('waifu-toggle');
  toggle?.addEventListener('click', () => {
    toggle?.classList.remove('waifu-toggle-active');
    if (toggle?.getAttribute('first-time')) {
      logger.info('First time toggle clicked, loading widget...');
      globals = loadWidget(config as Config);
      toggle?.removeAttribute('first-time');
    } else {
      localStorage.removeItem('waifu-display');
      document.getElementById('waifu')?.classList.remove('waifu-hidden');
      setTimeout(() => {
        document.getElementById('waifu')?.classList.add('waifu-active');
      }, 0);
    }
  });
  
  if (
    localStorage.getItem('waifu-display') &&
    Date.now() - Number(localStorage.getItem('waifu-display')) <= 86400000
  ) {
    toggle?.setAttribute('first-time', 'true');
    setTimeout(() => {
      toggle?.classList.add('waifu-toggle-active');
    }, 0);
  } else {
    logger.info('Loading widget without first-time toggle');
    globals = loadWidget(config as Config);
  }

  return globals;
}

export { initWidget };
