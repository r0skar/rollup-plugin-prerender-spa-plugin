import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import Prerenderer from '@prerenderer/prerenderer'
import Puppeteer from '@prerenderer/renderer-puppeteer'

const mkdirAsync = promisify(fs.mkdir)
const existsAsync = promisify(fs.exists)
const writeFileAsync = promisify(fs.writeFile)

const startPrerenderer = async (options) => {
  const { staticDir, routes, puppeteer = {}, ...config } = options

  if (!staticDir) throw Error('`staticDir` must be of type `string`')

  if (!routes || routes.length === 0) throw Error('`routes` must be of type `string[]`')

  const renderer = new Puppeteer(puppeteer)
  const prerenderer = new Prerenderer({ renderer, staticDir, ...config })

  await prerenderer.initialize()
  const rendered = await prerenderer.renderRoutes(routes)

  for (const route of rendered) {
    try {
      const out = path.join(staticDir, route.route)
      const file = path.normalize(`${out}/index.html`)
      const dirExists = await existsAsync(out)
      if (!dirExists) await mkdirAsync(out)
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
