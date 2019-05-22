export = prerendererPlugin

declare function prerendererPlugin (options?: PrerendererConfig): import('rollup').Plugin

export interface PrerendererConfig {
  staticDir: string
  routes: string[]
  indexPath?: string
  renderer?: PuppeteerConfig
}

interface PuppeteerConfig {
  injectProperty?: string
  inject?: { [key: string]: unknown }
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
