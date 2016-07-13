const path = require('path')
const fs = require('fs')

module.exports = (confFile, pluginsList) => {
  let res
  const cwd = process.cwd()
  if (confFile) {
    // get full path to config file
    const composerPath = path.join(cwd, confFile)
    try {
      // check file exists
      fs.accessSync(composerPath, fs.F_OK)
      // access the module and retrieve the list of plugins
      res = require(composerPath)()
      if (!Array.isArray(res)) {
        throw new Error('Postcss config module must return an array')
      }
    } catch (e) {
      res = `Module '${composerPath}' doesn't exist or isn't a valid module.`
    }
  } else if (pluginsList) {
    try {
      res = pluginsList.map((moduleName) => {
        const target = moduleName.startsWith('.') ? path.join(cwd, moduleName) : moduleName
        return require(target)()
      })
    } catch (e) {
      res = e ? e.message : `Something wrong happened requiring postcss plugins`
    }
  }
  return res
}
