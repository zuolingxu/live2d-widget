/**
 * @file Contains the configuration and functions for waifu tools.
 * @module tools
 */

import {
  fa_comment,
  fa_paper_plane,
  fa_street_view,
  fa_shirt,
  fa_camera_retro,
  fa_info_circle,
  fa_xmark
} from './icons.js';
import { showMessage, i18n } from './message.js';
import type { ModelManager } from './model.js';
import type { Tips } from './widget.js';

interface Tool {
    /**
     * Tool name.
     * @type {string}
     */
    name: string,
    /**
     * Tool icon, usually an SVG string.
     * @type {string}
     */
    icon: string,
    /**
     * Callback function for the tool.
     * @type {() => void}
     */
    callback: (message: any) => void,
}

/**
 * Waifu tools manager.
 */
class ToolsManager {
  tools: Tool[];

  constructor(model: ModelManager, tips: Tips) {
    this.tools = [
      /**
         * Tool list, each tool has a name, icon and callback function.
         * The callback function will be called when the tool is clicked.
         * @type {Tool[]}
         */
      {
        name: 'Hitokoto',
        icon: fa_comment,
        callback: async () => {
          // Add hitokoto.cn API
          const response = await fetch('https://v1.hitokoto.cn');
          const result = await response.json();
          const template = tips.message.hitokoto;
          const text = i18n(template, result.from, result.creator);
          showMessage(result.hitokoto, 6000, 9);
          setTimeout(() => {
            showMessage(text, 4000, 9);
          }, 6000);
        }
      },
      {
        name: 'Asteroids',
        icon: fa_paper_plane,
        callback: () => {
          if (window.Asteroids) {
            if (!window.ASTEROIDSPLAYERS) window.ASTEROIDSPLAYERS = [];
            window.ASTEROIDSPLAYERS.push(new window.Asteroids());
          } else {
            const script = document.createElement('script');
            script.src =
                'https://fastly.jsdelivr.net/gh/stevenjoezhang/asteroids/asteroids.js';
            document.head.appendChild(script);
          }
        }
      },
      {
        name: 'Switch Model',
        icon: fa_street_view,
        callback: () => {}
      },
      {
        name: 'Switch Texture',
        icon: fa_shirt,
        callback: () => { }
      },
      {
        name: 'Take Photo',
        icon: fa_camera_retro,
        callback: () => {
          const message = tips.message.photo;
          showMessage(message, 6000, 9);
          const canvas = document.getElementById('live2d') as HTMLCanvasElement;
          if (!canvas) return;
          const imageUrl = canvas.toDataURL();

          const link = document.createElement('a');
          link.style.display = 'none';
          link.href = imageUrl;
          link.download = 'live2d-photo.png';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      },
      {
        name: 'Info',
        icon: fa_info_circle,
        callback: () => {
          open('https://github.com/stevenjoezhang/live2d-widget');
        }
      },
      {
        name: 'Quit',
        icon: fa_xmark,
        callback: () => {
          localStorage.setItem('waifu-display', Date.now().toString());
          const message = tips.message.goodbye;
          showMessage(message, 2000, 11);
          const waifu = document.getElementById('waifu');
          if (!waifu) return;
          waifu.classList.remove('waifu-active');
          setTimeout(() => {
            waifu.classList.add('waifu-hidden');
            const waifuToggle = document.getElementById('waifu-toggle');
            waifuToggle?.classList.add('waifu-toggle-active');
          }, 3000);
        }
      }
    ]
  }

  addNewElement(name: string, icon: string, callback: (message: any) => void): HTMLSpanElement {
    const element = document.createElement('span');
    element.id = `waifu-tool-${Object.keys(this.tools).length}`;
    element.innerHTML = icon;
    element.addEventListener('click', callback);

    // delete element first
    const existingTool = document.getElementById(element.id);
    if (existingTool)
      existingTool.remove();

    // add new element
    document
      .getElementById('waifu-tool')
      ?.insertAdjacentElement(
        'beforeend',
        element,
      );

    return element;
  }

  public loadTools() {
    for (const toolPos of Object.keys(this.tools)) {
      if (this.tools[toolPos]) {
        const {name, icon, callback } = this.tools[toolPos];
        this.addNewElement(name, icon, callback);
      }
    }
  }

  public static registerTool(instance: ToolsManager, pos:number, new_tool: Tool) {
    if (instance.tools[pos]) {
      console.log(`Overwriting tool at position ${pos}, previously: ${instance.tools[pos].name}`);
    }
    instance.tools[pos] =  new_tool;
    instance.addNewElement(new_tool.name, new_tool.icon, new_tool.callback);
  }
}


export { ToolsManager, Tool};
