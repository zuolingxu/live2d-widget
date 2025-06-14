/**
 * @file Export APIs to window.
 * @module waifu-tips
 */

import { initWidget } from './widget';
import { ToolsManager } from './tools.js';

// 暴露到 window 对象
window.initWidget = initWidget;
window.changeTool = ToolsManager.registerTool;