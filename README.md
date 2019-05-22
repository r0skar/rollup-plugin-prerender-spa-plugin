# rollup-plugin-spa-prerenderer

Basic rollup plugin that runs the [spa-prerenderer](https://github.com/chrisvfritz/prerender-spa-plugin) after each build.

## Installation

`yarn add -D rollup-plugin-spa-prerenderer`


## Configuration

```js
// rollup.config.js
import spaPrerenderer from 'rollup-plugin-spa-prerenderer'

export default {
  plugins: [
    spaPrerenderer({
      // Required - The path to the outputted app to prerender.
      staticDir: path.resolve(__dirname, 'dist'),

      // Required - An array of routes to be passed to the prerenderer.
      routes: [ '/' ],

      // Optional - Additional Puppeteer options.
      // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
      puppeteer: {}
    })
  ]
}
```

## Disclaimer

This plugin was developed for internal usage and is heavily customized to my particular workflow.
