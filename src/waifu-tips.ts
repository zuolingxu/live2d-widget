/**
 * @file Export APIs to window.
 * @module waifu-tips
 */

import { initWidget } from './widget';
import { ToolsManager } from './tools.js';
import { showMessage } from './message.js';


// 暴露到 window 对象
window.initWidget = initWidget;
window.changeTool = ToolsManager.changeTool;
window.addTool = ToolsManager.addTool;
window.removeTool = ToolsManager.removeTool;
window.showMessage = showMessage;