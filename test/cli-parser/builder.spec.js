/* eslint-disable no-underscore-dangle */
import assert from 'assert'
import { yargsMock } from './helpers'
import builder from '../../src/cli-parser/builder'

const yargs = yargsMock

describe('CLI parser', () => {
  describe('builder', () => {
    it('should receive CLI usage string', () => {
      yargs.reset()
      const returnedValue = builder(yargsMock)

      assert.equal(returnedValue, yargs)
      assert.equal(
        returnedValue.usageStr,
        '$0 -s <source folder> -t <target folder> -n <output name> -p <plugin modules>'
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
})
