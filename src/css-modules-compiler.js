const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')
const read = require('fs-readdir-recursive')
const t = require('babel-types')
const del = require('del')

const discardEmpty = require('postcss-discard-empty')
const discardDuplicates = require('postcss-discard-duplicates')

const { extract } = require('./css-modules-extractor')
const { updateCssImports } = require('./update-css-modules-imports')

const filter = (file) => file.endsWith('.js')

const convertCssMapToAst = (map) => Object.keys(map).map((key) => t.objectProperty(t.identifier(key), t.stringLiteral(map[key])))
const convertCssMapToAstMap = (map) => Object.keys(map)
  .reduce((acc, key) => acc.set(key, convertCssMapToAst(map[key])), new Map())

const updateFilesystem = ({ file, code }) => {
  // write only files that have a truthy returned code value
  if (code) {
    // return fs.writeFileAsync(file, code)
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
  fs.writeFileAsync(cssOutput, styles)
  return { map, styles }
}

const DEFAULT_OPTIONS = {
  plugins: [],
  targetFolder: null,
  targetName: 'style.css'
}

const compileCss = (source, options) => {
  const { plugins, targetFolder, targetName, targetCss } = Object.assign({}, DEFAULT_OPTIONS, options)

  // TODO: add to docs to avoid passing this plugins to avoid duplicates
  plugins.push(discardEmpty()/*, discardDuplicates()*/)

  return new Promise((resolve, reject) => {
    // check source is a valid paths
    let sourcePath = source
    if (!path.isAbsolute(sourcePath)) {
      sourcePath = path.resolve(process.cwd(), source)
    }

    //Check if source exists
    try {
      fs.accessSync(sourcePath, fs.F_OK);
    } catch (e) {
      return reject(`Received source folder doesn't exist`)
    }

    // extract css
    const plug = plugins || []
    extract(sourcePath, ...plug)
      .then(updateImports(sourcePath))
      .then(cleanCss(sourcePath))
      .then(concatenateCss(sourcePath, targetName))
      .catch((reason) => console.error(reason))

    resolve()
  })
}

module.exports = { compileCss }
