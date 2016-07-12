const { exit } = require('shelljs')
const emoji = require('node-emoji')
const debug = require('debug')('cmc:bin')
const error = require('debug')('cmc:bin:error')
const { compileCss } = require('../compiler')
const getPlugins = require('./get-plugins')

const closeProcess = (code) => {
  if (process.env.NODE_ENV === 'test') {
    return false
  }
  return exit(code)
}

module.exports = (argv) => {
  const {
    source,
    target,
    name,
    pconf,
    plugins = [],
    blacklist = [],
  } = argv

  const options = {
    targetFolder: target,
    plugins: getPlugins(pconf, plugins),
    targetName: name,
    blacklist,
  }

  if (options.plugins && !Array.isArray(options.plugins)) {
    error(options.plugins)
    return closeProcess(1)
  }

  if (!options.plugins) {
    options.plugins = []
  }

  return compileCss(source, options)
    .then(() => {
      debug(`Css modules compiled! ${emoji.get(':punch:')}`)
      closeProcess(0)
    })
    .catch((res) => {
      error(`Error Compiling css Modules ${emoji.get(':rotating_light:')}`, res)
      closeProcess(1)
    })
}
