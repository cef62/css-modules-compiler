const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const fsExtra = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const read = require('fs-readdir-recursive')
const t = require('babel-types')
const del = require('del')
const listSelectors = require('list-selectors')

const { extract } = require('./extractor')
const { updateCssImports } = require('./update-imports')

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
    .then(() => Object.assign({}, opts, { cssOutput }))
}

const clearJsonMap = (opts) => new Promise((resolve) => {
  // retrieve css classes list
  listSelectors(opts.cssOutput, { include: ['classes'] }, (list) => {
    // remove selectors initial dot
    const selectors = list.classes.reduce((acc, sel) => acc.add(sel.slice(1)), new Set())

    /* eslint-disable no-param-reassign */
    // remove non existent classes from JSON map
    const map = Object.keys(opts.map).reduce((acc, key) => {
      // file import map
      const value = opts.map[key]

      // iterate every key of the import object
      const newValue = Object.keys(value).reduce((res, subKey) => {
        res[subKey] = value[subKey]
          .split(' ')
          .filter((className) => selectors.has(className))
          .join(' ')
        return res
      }, {})

      // store int the updated map
      acc[key] = newValue
      return acc
    }, {})
    /* eslint-enable */

    resolve(Object.assign({}, opts, { map }))
  })
})

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
      .then(cleanCss(workingDir))
      .then(concatenateCss(workingDir, fileName))
      .then(clearJsonMap)
      .then(updateImports(workingDir))
      .then(resolve)
      .catch((reason) => console.error(reason))
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

  return copySourceFolder(sourcePath, targetFolderPath).then((workingDir) => {
    // Check if source exists
    try {
      fs.accessSync(workingDir, fs.F_OK)
    } catch (e) {
      console.log(`Folder '${workingDir}' folder doesn't exist`)
    }

    return execCompileCss(targetName, workingDir, blacklist, plugins)
  })
}

module.exports = { compileCss }
