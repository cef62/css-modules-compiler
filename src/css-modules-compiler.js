const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const fsExtra = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const read = require('fs-readdir-recursive')
const t = require('babel-types')
const del = require('del')

const { extract } = require('./css-modules-extractor')
const { updateCssImports } = require('./update-css-modules-imports')

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
  }

  const updateImports = (sourcePath) => ({ map, styles }) => {
    // create an array where values are in a valid AST object property
    const astMap = convertCssMapToAstMap(map)

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
      .then(() => ({ map, styles }))
  }

  const cleanCss = (sourcePath) => ({ map, styles }) => {
    return del([`${sourcePath}/**/*.css`])
      .then(() => ({ map, styles }))
  }

  const concatenateCss = (targetFolder, targetName) => ({ map, styles }) => {
    const cssOutput = path.join(targetFolder, targetName)
    return fs.writeFileAsync(cssOutput, styles)
      .then(() => ({ map, styles }))
  }

  const DEFAULT_OPTIONS = {
    plugins: [],
    targetFolder: null,
    targetName: 'style.css'
  }

  const copySourceFolder = (source, target) => {
    if (!target || source === target) {
      return Promise.resolve(source)
    }

    return fsExtra.copyAsync(source, target, {
      clobber: true,
      filter(target) {
        return target.indexOf('.DS_Store') === -1
      }
    }).then(() => target)
  }


  const execCompileCss = (fileName, workingDir, plugins = []) => {
    return new Promise((resolve, reject) => {
      // extract css
      extract(workingDir, ...plugins)
        .then(updateImports(workingDir))
        .then(cleanCss(workingDir))
        .then(concatenateCss(workingDir, fileName))
        .then(resolve)
        .catch((reason) => console.error(reason))
    })
  }

  const compileCss = (source, options) => {
    const { plugins, targetFolder, targetName } = Object.assign({}, DEFAULT_OPTIONS, options)

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
      //Check if source exists
      try {
        fs.accessSync(workingDir, fs.F_OK);
      } catch (e) {
        return reject(`Folder '${workingDir}' folder doesn't exist`)
      }

      return execCompileCss(targetName, workingDir, plugins)
    })
  }

  module.exports = { compileCss }
