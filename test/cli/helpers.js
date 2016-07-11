import Promise from 'bluebird'

// ------------------------------------------------------
// Compiler mock

function compiler(...args) {
  compiler.invoked(args)
  return new Promise(() => {})
}
compiler.counter = 0
compiler.lastArgs = null
compiler.invoked = (args) => {
  compiler.counter = compiler.counter + 1
  compiler.lastArgs = args
}
compiler.reset = () => {
  compiler.counter = 0
  compiler.lastArgs = null
}

exports.compiler = compiler

// ------------------------------------------------------
// Error logger mock

function error(...args) {
  error.invoked(args)
  return new Promise(() => {})
}
error.counter = 0
error.lastArgs = null
error.invoked = (args) => {
  error.counter = error.counter + 1
  error.lastArgs = args
}
error.reset = () => {
  error.counter = 0
  error.lastArgs = null
}

exports.error = error

// ------------------------------------------------------
// yargs mock

const yargs = {
  usage(str) {
    yargs.usageStr = str
    return yargs
  },
  help() { return yargs },
  option(name, opts = {}) {
    yargs.options.push({ name, opts })
    return yargs
  },
  reset() {
    yargs.options = []
    yargs.usageStr = null
  },
  options: [],
}

exports.yargs = yargs

// ------------------------------------------------------
// node `path` module mock

const path = {
  join(...args) { return args.join('/') },
}

exports.path = path

// ------------------------------------------------------
// node `fs` module mock

let failAccessSync
const fs = {
  F_OK: 'F_OK',
  accessSync() {
    if (failAccessSync) {
      throw new Error('error')
    }
  },
}

exports.fs = fs
