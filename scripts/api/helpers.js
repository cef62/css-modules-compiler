const sh = require('shelljs')
const rimraf = require('rimraf')
const Promise = require('bluebird')

const cleanFolders = (target) => new Promise((resolve, reject) => {
  if (!target) {
    reject(`No target folder passed to 'cleanFolder()'`)
  }

  rimraf(target, (err) => {
    if (err) {
      sh.echo(`Something went wrong deleting target folders: ${target}.`, err)
      reject(err)
    }
    sh.echo(`[${target}] deleted`)
    resolve()
  })
})

const exec = (code, errorMsg = 'Something went wrong', silent = false) =>
  new Promise((resolve, reject) => {
    sh.exec(code, { silent }, (errorCode, stdout, stderr) => {
      if (errorCode) {
        reject(stderr || errorMsg)
      }
      resolve()
    })
  })

const echo = (silent, ...msgs) => {
  if (!silent) {
    sh.echo(...msgs)
  }
}

module.exports = { cleanFolders, exec, echo }
