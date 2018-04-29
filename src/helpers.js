/* eslint-disable import/prefer-default-export */

/**
 * Open the location in a new tab.
 * @param {string} url The new URL.
 */
function openNewTab(url) {
  chrome.tabs.create({ url });
}

/**
 * Update the location in the current tab.
 * @param {string} url The new URL.
 */
function updateTabLocation(url) {
  chrome.tabs.update({ url });
}

/**
 * Handle link click.
 * Special case for internal Chrome links in an extention.
 * @param {MouseEvent} event the click event
 */
export function onLinkClick(event) {
  const { target, ctrlKey } = event;
  const url = target.href;

  // only apply special handling to non-http links
  if (url.charAt(0) !== 'h') {
    event.preventDefault();

    if (target.target === '_blank' || ctrlKey) {
      openNewTab(url);
    } else {
      updateTabLocation(url);
    }
  }
}
