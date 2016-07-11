/* eslint-disable no-underscore-dangle */
import assert from 'assert'
import { compiler, error, fs, path, yargs } from './helpers'

const parser = require('../../src/cli-parser')
parser.__Rewire__('compiler', compiler)
parser.__Rewire__('error', error)
parser.__Rewire__('fs', fs)
parser.__Rewire__('path', path)

describe('CLI parser - .command', () => {
  it('should equal to `compile`', () => {
    assert.equal(parser.command, 'compile')
  })
})

describe('CLI parser - .describe', () => {
  it('should equal to '
    + '`Compile css-modukes to a single css file and update css import in Javascript`', () => {
    assert.equal(
      parser.describe,
      'Compile css-modukes to a single css file and update css import in Javascript'
    )
  })
})

describe('CLI parser - .handler()', () => {
  it('should parse parameters and apply defaults where required', () => {
    compiler.reset()

    const argv = {
      source: './src',
      target: '.build',
      name: 'my-styles.css',
    }
    parser.handler(argv)

    assert.equal(compiler.counter, 1)
    assert.equal(compiler.lastArgs[0], argv.source)
    assert.equal(compiler.lastArgs[1].targetName, argv.name)
    assert.ok(Array.isArray(compiler.lastArgs[1].blacklist))
    assert.equal(compiler.lastArgs[1].blacklist.length, 0)
    assert.ok(Array.isArray(compiler.lastArgs[1].plugins))
    assert.equal(compiler.lastArgs[1].plugins.length, 0)
  })

  it('should use passed blacklist', () => {
    compiler.reset()

    const argv = {
      source: './src',
      target: '.build',
      name: 'my-styles.css',
      blacklist: ['*.global.css', '*.ignore.css'],
    }
    parser.handler(argv)

    assert.equal(compiler.counter, 1)
    assert.equal(compiler.lastArgs[1].blacklist, argv.blacklist)
  })

  it('should import passed list of postcss plugins', () => {
    compiler.reset()

    const root = path.join(__dirname, `fixtures`)
    const simplePlugin = path.join(root, 'simple-plugin')
    const otherPlugin = path.join(root, 'other-plugin')

    const argv = {
      source: './src',
      target: '.build',
      name: 'my-styles.css',
      plugins: [simplePlugin, otherPlugin],
    }
    parser.handler(argv)

    assert.equal(compiler.counter, 1)
    assert.ok(Array.isArray(compiler.lastArgs[1].plugins))
    assert.equal(compiler.lastArgs[1].plugins.length, 2)
    assert.equal(compiler.lastArgs[1].plugins[0], 'simple')
    assert.equal(compiler.lastArgs[1].plugins[1], 'other')
  })

  it('should import passed plugins config module', () => {
    compiler.reset()

    const pluginConfig = path.join('test', 'cli', `fixtures`, 'plugins-config')

    const argv = {
      source: './src',
      target: '.build',
      name: 'my-styles.css',
      pconf: pluginConfig,
    }
    parser.handler(argv)

    assert.equal(compiler.counter, 1)
    assert.ok(Array.isArray(compiler.lastArgs[1].plugins))
    assert.equal(compiler.lastArgs[1].plugins.length, 2)
    assert.equal(compiler.lastArgs[1].plugins[0](), 'simple')
    assert.equal(compiler.lastArgs[1].plugins[1](), 'other')
  })
})

describe('CLI parser - .builder()', () => {
  it('should receive CLI usage string', () => {
    yargs.reset()
    const returnedValue = parser.builder(yargs)

    assert.equal(returnedValue, yargs)
    assert.equal(
      returnedValue.usageStr,
      '$0 -s sourceFolder -t targetFolder -n style.css -p postcss-cssnext autoprefixer'
    )
    assert.equal(returnedValue.options[0].name, 's')
    assert.equal(returnedValue.options[0].opts.alias, 'source')
    assert.equal(returnedValue.options[1].name, 't')
    assert.equal(returnedValue.options[1].opts.alias, 'target')
    assert.equal(returnedValue.options[2].name, 'p')
    assert.equal(returnedValue.options[2].opts.alias, 'plugins')
    assert.equal(returnedValue.options[3].name, 'plugins-config')
    assert.equal(returnedValue.options[3].opts.alias, 'pconf')
    assert.equal(returnedValue.options[4].name, 'n')
    assert.equal(returnedValue.options[4].opts.alias, 'name')
    assert.equal(returnedValue.options[5].name, 'b')
    assert.equal(returnedValue.options[5].opts.alias, 'blacklist')
  })
})
