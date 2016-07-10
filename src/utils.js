const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const fsExtra = Promise.promisifyAll(require('fs-extra'))
const path = require('path')
const del = require('del')

const updateFilesystem = ({ file, code }) =>
  (code ? fs.writeFileAsync(file, code) : Promise.resolve())

const cleanCss = (sourcePath) => (opts) => {
  const files = opts.files.map((file) => path.join(sourcePath, file))

  return del(files).then(() => (opts))
}

const concatenateCss = (targetFolder, targetName) => (opts) => {
  const cssOutput = path.join(targetFolder, targetName)

  return fs.writeFileAsync(cssOutput, opts.styles)
    .then(() => Object.assign({}, opts, { cssOutput }))
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

module.exports = { updateFilesystem, cleanCss, concatenateCss, copySourceFolder }
