/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

const { gitRef } = require('git-ref');
const pkg = require('./package.json');

const manifest = {
  manifest_version: 2,

  // registered extension ID: cpcibnbdmpmcmnkhoiilpnlaepkepknb
  key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk9BfRa5CXuCX1ElY0yu9kJSqxFirFtSy79ZR/fyKHdOzZurQXNmhIyxVnQXd2bxHvuKUyZGahm/gwgyyzGuxhsQEue6wTD9TnOvvM2vusXpnoCr6Ili7sBwUo9vA2aPI77NB0eArXz9WWNmoDWW5WEqI/rk26Tinl8SNU9iDJISbL+dMses1QPw64oYFWB1J4JeB1MhXnzTxECpGZTn33LhgBU4J3ooT6eoqrsJdRvuc0vjPMxq/jfqLkdBbzlsnrMbgtDoJ9WiWj2lA0MzHGDAQ8HgnMEi3SpXRNnod9CCBnxmkHqv3u4u7Tvp/WLAgJ+QjCt+9yYyw3nOYHpEweQIDAQAB',

  name: 'New Tab',
  description:
    '⚡ A high performance new tab page that gets you where you need to go faster.',
  version: pkg.version,
  version_name: gitRef(),
  homepage_url: pkg.homepage,
  icons: {
    16: 'icon16.png',
    48: 'icon48.png',
    128: 'icon128.png',
  },
  permissions: [
    'bookmarks',
    'chrome://favicon/',
    'history',
    'storage',
    'tabs',
    'topSites',
  ],
  chrome_url_overrides: {
    newtab: 'newtab.html',
  },
  options_ui: {
    page: 'settings.html',
  },
  offline_enabled: true,
  incognito: 'not_allowed',
  content_security_policy:
    "default-src 'none';"
    // SHA of theme loader script embedded inline in the document
    + " script-src 'self' 'sha256-FtIFk1UjzWWlhfMrIdJ9n60rbnTmldIAss9HFJTJeUM=';"
    + " style-src 'unsafe-inline';"
    // `data:` used in settings page
    + ' img-src chrome://favicon data:;',
};

module.exports = JSON.stringify(manifest);
