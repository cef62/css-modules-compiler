#!/usr/bin/env node

const { exit } = require('shelljs')
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
.option('n', {
  alias: 'name',
  requiresArg: true,
  describe: 'Name for the generated css file, default to style.css',
  type: 'string',
  default: 'style.css',
})
.option('b', {
  alias: 'blacklist',
  requiresArg: true,
  describe: 'Space separated sequence of patterns used to filter css files from compilation.',
  type: 'array',
  default: 'style.css',
}).argv

const options = {
  targetFolder: target,
  plugins: plugins.map((moduleName) => require(moduleName)()),
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
