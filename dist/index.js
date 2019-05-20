'use strict';

var fs = require('fs');
var path = require('path');
var Prerenderer = require('@prerenderer/prerenderer');
var Puppeteer = require('@prerenderer/renderer-puppeteer');
var util = require('util');

const DIST_FOLDER = '/home/oskar/dev/selbststaendig.jetzt/dist';

const writeFileAsync = util.promisify(fs.writeFile);

const startPrerenderer = async (options) => {
  if (!options.routes || options.routes.length === 0) throw Error('`routes` must be of type string[]')

  const renderer = new Puppeteer(options.inject ? { inject: options.inject } : undefined);
  const prerenderer = new Prerenderer({ staticDir: DIST_FOLDER, renderer });

  await prerenderer.initialize();
  const rendered = await prerenderer.renderRoutes(options.routes);

  for (const route of rendered) {
    try {
      const out = path.join(DIST_FOLDER, route.route);
      const file = path.normalize(`${out}/index.html`);
      console.info(`Rendering route "${route.route}"...`);
      await writeFileAsync(file, route.html);
    } catch (e) {
      console.warn(`Skipping route "${route.route}"`, e);
    }
  }

  prerenderer.destroy();
};

const rollupPrerenderer = (options = {}) => ({
  name: 'prerenderer',
  writeBundle: () =>  {
    try {
      startPrerenderer(options);
    } catch (e) {
      console.error(e);
    }
  }
});

module.exports = rollupPrerenderer;
