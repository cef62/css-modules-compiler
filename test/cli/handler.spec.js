/* eslint-disable no-underscore-dangle */
import assert from 'assert'
import Promise from 'bluebird'
import { createSpy } from './helpers'
import handler from '../../src/cli-parser/handler'

const compiler = createSpy(() => new Promise(() => {}))
const getPluginsSuccess = createSpy((args) => args[1])
const getPluginsFail = createSpy(() => 'some error')
const getPluginsEmpty = createSpy(() => {})

const error = createSpy()
const debug = createSpy()

handler.__Rewire__('compileCss', compiler)
handler.__Rewire__('error', error)
handler.__Rewire__('debug', debug)

describe('CLI - .handler()', () => {
  it('should parse parameters and apply defaults where required', () => {
    handler.__Rewire__('getPlugins', getPluginsEmpty)
    getPluginsEmpty.reset()
    compiler.reset()

    const argv = {
      source: './src',
      target: '.build',
      name: 'my-styles.css',
    }
    handler(argv)

    assert.equal(compiler.counter, 1)
    assert.equal(compiler.lastArgs[0], argv.source)
    assert.equal(compiler.lastArgs[1].targetName, argv.name)
    assert.ok(Array.isArray(compiler.lastArgs[1].blacklist))
    assert.equal(compiler.lastArgs[1].blacklist.length, 0)
    assert.ok(Array.isArray(compiler.lastArgs[1].plugins))
    assert.equal(compiler.lastArgs[1].plugins.length, 0)
  })

  it('should use passed blacklist', () => {
    handler.__Rewire__('getPlugins', getPluginsEmpty)
    getPluginsEmpty.reset()
    compiler.reset()

    const argv = {
      source: './src',
      target: '.build',
      name: 'my-styles.css',
      blacklist: ['*.global.css', '*.ignore.css'],
    }
    handler(argv)

    assert.equal(compiler.counter, 1)
    assert.equal(compiler.lastArgs[1].blacklist, argv.blacklist)
  })

  it('should throws if `get-plugin` return an error string', () => {
    handler.__Rewire__('getPlugins', getPluginsFail)
    getPluginsFail.reset()
    compiler.reset()
    error.reset()

    const argv = {
      plugins: ['a', 'b'],
    }
    handler(argv)

    assert.equal(getPluginsFail.counter, 1)
    assert.equal(error.counter, 1)
    assert.equal(compiler.counter, 0)
  })

  it('should pass the loaded plugins list to the compiler', () => {
    handler.__Rewire__('getPlugins', getPluginsSuccess)
    getPluginsSuccess.reset()
    compiler.reset()

    const argv = {
      source: './src',
      target: '.build',
      name: 'my-styles.css',
      plugins: ['a', 'b'],
    }
    handler(argv)

    assert.equal(getPluginsFail.counter, 1)
    assert.equal(compiler.counter, 1)
    assert.ok(Array.isArray(compiler.lastArgs[1].plugins))
    assert.equal(compiler.lastArgs[1].plugins.length, 2)
    assert.equal(compiler.lastArgs[1].plugins[0], argv.plugins[0])
    assert.equal(compiler.lastArgs[1].plugins[1], argv.plugins[1])
  })
})
