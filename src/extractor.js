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

const match = (file) => (rule) => minimatch(file, rule, { matchBase: true })

const filter = (blacklist) => (file) => file.endsWith('css') && !blacklist.some(match(file))

const getJSON = (cssFileName, json) => (map[cssFileName] = json)

const store = (processed) => styles.push(processed.css)

const process = (source, plugins) => (file) => {
  const fromPath = path.join(source, file)
  const css = fs.readFileSync(fromPath)

  return postcss(...plugins, modules({ getJSON })).process(css, { from: fromPath }).then(store)
}

const optimize = () => {
  const plugins = [discardComments(), discardDuplicates(), discardEmpty()]

  return postcss(...plugins).process(styles.join(''))
}

const result = (optimized) => ({ styles: optimized.css, map, files })

const extract = (source, blacklist = [], ...plugins) => {
  styles = []
  map = {}
  files = read(source).filter(filter(blacklist))

  const processes = files.map(process(source, plugins))

  return Promise.all(processes).then(optimize).then(result)
}

module.exports = { extract }
