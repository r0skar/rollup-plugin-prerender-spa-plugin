import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import Prerenderer from '@prerenderer/prerenderer'
import Puppeteer from '@prerenderer/renderer-puppeteer'

const writeFileAsync = promisify(fs.writeFile)

const startPrerenderer = async (options) => {
  const { routes, renderer = {}, ...config } = options

  if (!config.staticDir) throw Error('`staticDir` must be of type `string`')

  if (!routes || routes.length === 0) throw Error('`routes` must be of type `string[]`')

  const puppeteer = new Puppeteer(renderer)
  const prerenderer = new Prerenderer({ renderer: puppeteer, ...config })

  await prerenderer.initialize()
  const rendered = await prerenderer.renderRoutes(routes)

  for (const route of rendered) {
    try {
      const out = path.join(staticDir, route.route)
      const file = path.normalize(`${out}/index.html`)
      console.info(`Rendering route "${route.route}"...`)
      await writeFileAsync(file, route.html)
    } catch (e) {
      console.warn(e)
    }
  }

  prerenderer.destroy()
}

const prerenderSpaPlugin = (options = {}) => ({
  name: 'prerenderSpaPlugin',
  writeBundle: () =>  {
    try {
      startPrerenderer(options)
    } catch (e) {
      console.error(e)
    }
  }
})

export default prerenderSpaPlugin
