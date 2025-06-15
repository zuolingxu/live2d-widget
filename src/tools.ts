/**
 * @file Contains the configuration and functions for waifu tools.
 * @module tools
 */

import {
  fa_comment,
  fa_paper_plane,
  fa_info_circle,
  fa_xmark
} from './icons.js';


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

  constructor() {
    this.tools = [
      /**
         * Tool list, each tool has a name, icon and callback function.
         * The callback function will be called when the tool is clicked.
         * @type {Tool[]}
         */
      {
        name: 'chat',
        icon: fa_comment,
        callback: async () => { }
      },
      {
        name: 'AsteroidsGame',
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
        name: 'placeholder',
        icon: fa_info_circle,
        callback: () => {
          open('https://github.com/zuolingxu/Interactive-Schedule-Planner');
        }
      },
      {
        name: 'placeholder',
        icon: fa_info_circle,
        callback: () => {
          open('https://github.com/zuolingxu/Interactive-Schedule-Planner');
        }
      },      {
        name: 'placeholder',
        icon: fa_info_circle,
        callback: () => {
          open('https://github.com/zuolingxu/Interactive-Schedule-Planner');
        }
      },      {
        name: 'Info',
        icon: fa_info_circle,
        callback: () => {
          open('https://github.com/zuolingxu/Interactive-Schedule-Planner');
        }
      },
      {
        name: 'Quit',
        icon: fa_xmark,
        callback: () => {
          localStorage.setItem('waifu-display', Date.now().toString());
          // const message = tips.message.goodbye;
          // showMessage(message, 2000, 11);
          const waifu = document.getElementById('waifu');
          if (!waifu) return;
          waifu.classList.remove('waifu-active');
          setTimeout(() => {
            waifu.classList.add('waifu-hidden');
            const waifuToggle = document.getElementById('waifu-toggle');
            waifuToggle?.classList.add('waifu-toggle-active');
          }, 0);
        }
      }
    ]
  }

  addNewElement(pos: number, name: string, icon: string, callback: (message: any) => void): HTMLSpanElement {
    const element = document.createElement('span');
    element.id = `waifu-tool-${pos}`;
    element.title = name;
    element.innerHTML = icon;
    element.addEventListener('click', callback);

    const toolContainer = document.getElementById('waifu-tool');
    if (!toolContainer) return element;

    // Find the next tool position
    const nextTool = document.getElementById(`waifu-tool-${pos + 1}`);

    // delete element first
    const existingTool = document.getElementById(element.id);
    if (existingTool) {
      // Store the next sibling before removing
      const insertBefore = existingTool.nextElementSibling;
      existingTool.remove();

      // Insert at the original position
      toolContainer.insertBefore(element, insertBefore);
    } else {
      // If no existing tool, insert before the next tool or at the end
      toolContainer.insertBefore(element, nextTool || null);
    }

    return element;
  }

  public loadTools() {
    for (let i = 0; i < this.tools.length; i++) {
      const { name, icon, callback } = this.tools[i];
      this.addNewElement(i, name, icon, callback);
    }
  }

  public static registerTool(instance: ToolsManager, pos:number, new_tool: Tool) {
    if (instance.tools[pos]) {
      console.log(`Overwriting tool at position ${pos}, previously: ${instance.tools[pos].name}`);
    }
    instance.tools[pos] =  new_tool;
    instance.addNewElement(pos, new_tool.name, new_tool.icon, new_tool.callback);
  }
}


export { ToolsManager, Tool};
