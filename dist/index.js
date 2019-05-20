'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var Prerenderer = require('@prerenderer/prerenderer');
var Puppeteer = require('@prerenderer/renderer-puppeteer');

const writeFileAsync = util.promisify(fs.writeFile);

const startPrerenderer = async (options) => {
  const { routes, puppeteer = {}, ...config } = options;

  if (!routes || routes.length === 0) throw Error('`routes` must be of type `string[]`')

  const renderer = new Puppeteer(puppeteer);
  const prerenderer = new Prerenderer({ renderer, ...config });

  await prerenderer.initialize();
  const rendered = await prerenderer.renderRoutes(routes);

  for (const route of rendered) {
    try {
      const out = path.join(config.staticDir, route.route);
      const file = path.normalize(`${out}/index.html`);
      console.info(`Rendering route "${route.route}"...`);
      await writeFileAsync(file, route.html);
    } catch (e) {
      console.warn(`Skipping route "${route.route}"`, e);
    }
  }

  prerenderer.destroy();
};

const rollupSpaPrerenderer = (options = {}) => ({
  name: 'spaPrerenderer',
  writeBundle: () =>  {
    try {
      startPrerenderer(options);
    } catch (e) {
      console.error(e);
    }
  }
});

module.exports = rollupSpaPrerenderer;
