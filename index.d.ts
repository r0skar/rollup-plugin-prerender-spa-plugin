export = prerendererPlugin

declare function prerendererPlugin (options?: PrerendererConfig): import('rollup').Plugin

interface PrerendererConfig {
  staticDir: string
  routes: string[]
  indexPath?: string
  renderer?: PuppeteerConfig
  server?: {
    port?: number
    proxy?: object
  }
}

interface RendererConfig {
  renderAfterDocumentEvent?: string
  renderAfterElementExists?: string
  renderAfterTime?: number
  maxConcurrentRoutes?: number
  skipThirdPartyRequests?: boolean
  consoleHandler?: (route: string, message: string) => void
  injectProperty?: string
  inject?: { [key: string]: unknown }
}

interface PuppeteerConfig extends RendererConfig {
  ignoreHTTPSErrors?: boolean
  headless?: boolean
  executablePath?: string
  slowMo?: number
  defaultViewport?: {
    width?: number
    height?: number
    deviceScaleFactor?: number
    isMobile?: boolean
    hasTouch?: boolean
    isLandscape?: boolean
  }
  args?: string[]
  ignoreDefaultArgs?: boolean | string[]
  handleSIGINT?: boolean
  handleSIGTERM?: boolean
  handleSIGHUP?: boolean
  timeout?: number
  dumpio?: boolean
  userDataDir?: string
  env?: { [key: string]: unknown }
  devtools?: boolean
  pipe?: boolean
}
