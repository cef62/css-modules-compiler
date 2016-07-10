#!/usr/bin/env node

const { exit } = require('shelljs')
const path = require('path')
const fs = require('fs')
const emoji = require('node-emoji')
const debug = require('debug')('cmc:bin')
const error = require('debug')('cmc:bin:error')

const compileCss = require('../src')
const {
  source,
  target,
  plugins = [],
  name,
  blacklist = [],
  pconf,
} = require('yargs')
.usage('$0 -s sourceFolder -t targetFolder -n style.css -p postcss-cssnext autoprefixer')
.help()
.option('s', {
  alias: 'source',
  demand: true,
  requiresArg: true,
  describe: 'Source folder to be processed, can be a relative or an absolute path.',
  type: 'string',
})
.option('t', {
  alias: 'target',
  requiresArg: true,
  describe: 'Target folder, if defined the source folder will be copied to the given '
    + 'path and the modules will process the duplicated folder.',
  type: 'string',
})
.option('p', {
  alias: 'plugins',
  requiresArg: true,
  describe: 'Space separated string of names of npm postcss plugins.'
    + ' This parameter must be defined as last.',
  type: 'array',
})
.option('plugins-config', {
  alias: 'pconf',
  requiresArg: true,
  describe: 'Path to a node module invoked at runtime to receive a list of plugins.'
    + 'The modules must export a function.',
  normalize: true,
  type: 'string',
})
.option('n', {
  alias: 'name',
  requiresArg: true,
  describe: 'Name for the generated css file, default to styles.css',
  type: 'string',
  default: 'styles.css',
})
.option('b', {
  alias: 'blacklist',
  requiresArg: true,
  describe: 'Space separated sequence of patterns used to filter css files from compilation.',
  type: 'array',
}).argv

const getPlugins = (confFile, pluginsList) => {
  let res
  if (confFile) {
    // get full path to config file
    res = path.join(process.cwd(), confFile)
    // check file exists
    try {
      fs.accessSync(res, fs.F_OK)
    } catch (e) {
      error(`Plugin configuration module '${res}' doesn't exist.`)
      exit(1)
    }
  } else if (pluginsList) {
    res = pluginsList.map((moduleName) => require(moduleName)())
  }
  return res
}

const options = {
  targetFolder: target,
  plugins: getPlugins(pconf, plugins),
  targetName: name,
  blacklist,
}

compileCss(source, options)
  .then(() => {
    debug(`Css modules compiled! ${emoji.get(':punch:')}`)
    exit(0)
  })
  .catch((res) => {
    error(`Error Compiling css Modules ${emoji.get(':rotating_light:')}`, res)
    exit(1)
  })
