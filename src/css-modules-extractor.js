const fs = require('fs')
const path = require('path')
const read = require('fs-readdir-recursive')
const postcss = require('postcss')
const modules = require('postcss-modules')
const Promise = require('bluebird')

let styles
let map

const filter = (file) => file.endsWith('css')

const getJSON = (source) => (cssFileName, json) => map[cssFileName] = json

const store = (result) => styles.push(result.css)

const process = (source, plugins) => (file) => {
  const fromPath = path.join(source, file)
  const css = fs.readFileSync(fromPath)

  return postcss(...plugins, modules({ getJSON: getJSON(source) }))
    .process(css, { from: fromPath })
    .then(store)
}

const result = () => ({ styles: styles.join(''), map })

const extract = (source, ...plugins) => {
  styles = []
  map = {}

  const files = read(source).filter(filter)
  const processes = files
    .filter((file) => { console.log(file); return true })
    .map(process(source, plugins))

  return Promise.all(processes).then(result)
}

module.exports = { extract }
