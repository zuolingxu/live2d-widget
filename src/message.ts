/**
 * @file Contains functions for displaying waifu messages.
 * @module message
 */

import { randomSelection } from './utils.js';

type Time = {
  /**
   * Time period, format is "HH-HH", e.g. "00-06" means from 0 to 6 o'clock.
   * @type {string}
   */
  hour: string;
  /**
   * Message to display during this time period.
   * @type {string}
   */
  text: string;
}[];

let messageTimer: NodeJS.Timeout | null = null;

/**
 * Display waifu message.
 * @param {string | string[]} text - Message text or array of texts.
 * @param {number} timeout - Timeout for message display (ms).
 * @param {number} priority - Priority of the message.
 * @param {boolean} [override=true] - Whether to override existing message.
 */
function showMessage(
  text: string | string[],
  timeout: number,
  priority: number,
  override: boolean = true
) {
  let currentPriority = parseInt(sessionStorage.getItem('waifu-message-priority'), 10);
  if (isNaN(currentPriority)) {
    currentPriority = 0;
  }
  if (
    !text ||
    (override && currentPriority > priority) ||
    (!override && currentPriority >= priority)
  )
    return;
  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }
  text = randomSelection(text) as string;
  sessionStorage.setItem('waifu-message-priority', String(priority));
  const tips = document.getElementById('waifu-tips')!;
  tips.innerHTML = text;
  tips.classList.add('waifu-tips-active');
  messageTimer = setTimeout(() => {
    sessionStorage.removeItem('waifu-message-priority');
    tips.classList.remove('waifu-tips-active');
  }, timeout);
}

export { showMessage, Time };
