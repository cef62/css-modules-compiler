const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const fsExtra = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const read = require('fs-readdir-recursive')
const t = require('babel-types')
const del = require('del')

const { extract } = require('./extractor')
const { updateCssImports } = require('./update-imports')

const chalk = require('chalk')
const debug = require('debug')('cmc:compiler')
const error = require('debug')('cmc:compiler:error')

const filter = (file) => file.endsWith('.js')

const convertCssMapToAst = (map) =>
  Object.keys(map).map((key) =>
    t.objectProperty(t.identifier(key), t.stringLiteral(map[key]))
  )

const convertCssMapToAstMap = (map) => Object.keys(map)
  .reduce((acc, key) => acc.set(key, convertCssMapToAst(map[key])), new Map())

const updateFilesystem = ({ file, code }) => {
  // write only files that have a truthy returned code value
  if (code) {
    return fs.writeFileAsync(file, code)
  }

  return Promise.resolve()
}

const updateImports = (sourcePath) => (opts) => {
  // create an array where values are in a valid AST object property
  const astMap = convertCssMapToAstMap(opts.map)

  // JS files to check and if required update
  const processes = read(sourcePath)
    .filter(filter)
    .map((file) => path.join(sourcePath, file))
    .map(
      (file) => updateCssImports(file, astMap)
        .then((code) => ({ file, code }))
        .then(updateFilesystem)
    )
  // FIXME: seems that running babel in parallel is really slow, try to run it in a sequence

  return Promise.all(processes)
    .then(updateFilesystem)
    .then(() => (opts))
}

const cleanCss = (sourcePath) => (opts) => {
  const files = opts.files.map((file) => path.join(sourcePath, file))
  return del(files)
    .then(() => (opts))
}

const concatenateCss = (targetFolder, targetName) => (opts) => {
  const cssOutput = path.join(targetFolder, targetName)
  return fs.writeFileAsync(cssOutput, opts.styles)
    .then(() => (opts))
}

const copySourceFolder = (source, target) => {
  if (!target || source === target) {
    return Promise.resolve(source)
  }

  return fsExtra.copyAsync(source, target, {
    clobber: true,
    filter(newTarget) {
      return newTarget.indexOf('.DS_Store') === -1
    },
  }).then(() => target)
}

const execCompileCss = (fileName, workingDir, blacklist = [], plugins = []) =>
  new Promise((resolve) => {
    // extract css
    extract(workingDir, blacklist, ...plugins)
      .then(updateImports(workingDir))
      .then(cleanCss(workingDir))
      .then(concatenateCss(workingDir, fileName))
      .then(resolve)
      .catch((reason) => { error(reason) })
  })

const DEFAULT_OPTIONS = {
  plugins: [],
  targetFolder: null,
  targetName: 'style.css',
  blacklist: [],
}

const compileCss = (source, options) => {
  const {
    plugins, targetFolder, targetName,
    blacklist,
  } = Object.assign({}, DEFAULT_OPTIONS, options)

  // check source is a valid paths
  let sourcePath = source
  if (!path.isAbsolute(sourcePath)) {
    sourcePath = path.resolve(process.cwd(), source)
  }

  // if targetFolder is defined copy the source folder
  let targetFolderPath = targetFolder
  if (targetFolderPath) {
    if (!path.isAbsolute(targetFolderPath)) {
      targetFolderPath = path.resolve(process.cwd(), targetFolderPath)
    }
  }

  debug(`Compile with options:`)
  debug(`-- ${chalk.inverse.bold('source')}: ${sourcePath}`)
  debug(`-- ${chalk.inverse.bold('target')}: ${targetFolderPath}`)
  debug(`-- ${chalk.inverse.bold('name')}: ${targetName}`)
  debug(`-- ${chalk.inverse.bold('blacklist')}: ${blacklist}`)

  return copySourceFolder(sourcePath, targetFolderPath).then((workingDir) => {
    // Check if source exists
    try {
      fs.accessSync(workingDir, fs.F_OK)
    } catch (e) {
      error(`Folder '${workingDir}' folder doesn't exist.`)
    }

    return execCompileCss(targetName, workingDir, blacklist, plugins)
  })
}

module.exports = { compileCss }
