'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');
var Prerenderer = require('@prerenderer/prerenderer');
var Puppeteer = require('@prerenderer/renderer-puppeteer');

const writeFileAsync = util.promisify(fs.writeFile);

const startPrerenderer = async (options) => {
  const { routes, renderer = {}, ...config } = options;

  if (!config.staticDir) throw Error('`staticDir` must be of type `string`')

  if (!routes || routes.length === 0) throw Error('`routes` must be of type `string[]`')

  const puppeteer = new Puppeteer(renderer);
  const prerenderer = new Prerenderer({ renderer: puppeteer, ...config });

  await prerenderer.initialize();
  const rendered = await prerenderer.renderRoutes(routes);

  for (const route of rendered) {
    try {
      const out = path.join(staticDir, route.route);
      const file = path.normalize(`${out}/index.html`);
      console.info(`Rendering route "${route.route}"...`);
      await writeFileAsync(file, route.html);
    } catch (e) {
      console.warn(e);
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
