import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import Prerenderer from '@prerenderer/prerenderer'
import Puppeteer from '@prerenderer/renderer-puppeteer'

const writeFileAsync = promisify(fs.writeFile)

const startPrerenderer = async (options) => {
  const { routes, puppeteer = {}, ...config } = options

  if (!routes || routes.length === 0) throw Error('`routes` must be of type `string[]`')

  const renderer = new Puppeteer(puppeteer)
  const prerenderer = new Prerenderer({ renderer, ...config })

  await prerenderer.initialize()
  const rendered = await prerenderer.renderRoutes(routes)

  for (const route of rendered) {
    try {
      const out = path.join(config.staticDir, route.route)
      const file = path.normalize(`${out}/index.html`)
      console.info(`Rendering route "${route.route}"...`)
      await writeFileAsync(file, route.html)
    } catch (e) {
      console.warn(`Skipping route "${route.route}"`, e)
    }
  }

  prerenderer.destroy()
}

const rollupSpaPrerenderer = (options = {}) => ({
  name: 'spaPrerenderer',
  writeBundle: () =>  {
    try {
      startPrerenderer(options)
    } catch (e) {
      console.error(e)
    }
  }
})

export default rollupSpaPrerenderer
