const fs = require('fs')
const path = require('path')
const read = require('fs-readdir-recursive')
const postcss = require('postcss')
const modules = require('postcss-modules')
const Promise = require('bluebird')
const minimatch = require('minimatch')

const discardEmpty = require('./postcss/discard-empty')
const discardDuplicates = require('./postcss/discard-duplicates')
const discardComments = require('./postcss/discard-comments')

let styles
let map
let files

const filter = (blacklist = []) => (file) => {
  // treat only css files
  if (file.endsWith('css')) {
    // check if the file must be blacklisted
    return !blacklist.some((rule) => minimatch(file, rule, { matchBase: true }))
  }
}

const getJSON = (source) => (cssFileName, json) => map[cssFileName] = json

const store = (result) => styles.push(result.css)

const process = (source, plugins) => (file) => {
  const fromPath = path.join(source, file)
  const css = fs.readFileSync(fromPath)

  return postcss(...plugins, modules({ getJSON: getJSON(source) }))
    .process(css, { from: fromPath })
    .then(store)
}

const result = () => ({ styles: optimize(styles.join('')), map, files })

const extract = (source, blacklist = [], ...plugins) => {
  styles = []
  map = {}

  files = read(source).filter(filter(blacklist))

  const processes = files
    .map(process(source, plugins))

  return Promise.all(processes).then(result)
}

const optimize = (css) => {
  const plugins = [discardComments(), discardDuplicates(), discardEmpty()]
  return postcss(...plugins)
    .process(css)
}

module.exports = { extract, optimize }
