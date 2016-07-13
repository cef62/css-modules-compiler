// ------------------------------------------------------
// create spies

const noop = () => {}
exports.createSpy = (returnFn = noop) => {
  function spy(...args) {
    spy.invoked(args)
    return returnFn(args)
  }
  spy.counter = 0
  spy.lastArgs = null
  spy.invoked = (args) => {
    spy.counter = spy.counter + 1
    spy.lastArgs = args
  }
  spy.reset = () => {
    spy.counter = 0
    spy.lastArgs = null
  }
  return spy
}

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

exports.yargsMock = yargs

// ------------------------------------------------------
// node `path` module mock

exports.pathMock = {
  join(...args) { return args.join('/') },
}

// ------------------------------------------------------
// node `fs` module mock

exports.fsMock = (failAccessSync) => ({
  F_OK: 'F_OK',
  accessSync() {
    if (failAccessSync) {
      throw new Error('error')
    }
  },
})
