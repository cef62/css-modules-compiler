/* eslint-disable no-underscore-dangle */
import assert from 'assert'
import { builder, command, describe as describeCommand, handler } from '../../src/cli-parser'

describe('CLI parser', () => {
  describe('command', () => {
    it('should equal to `compile`', () => {
      assert.equal(command, 'compile')
    })
  })

  describe('describe', () => {
    it('should equal to '
      + '`Compile css-modukes to a single css file and update css import in Javascript`',
    () => {
      assert.equal(
        describeCommand,
        'Compile css-modukes to a single css file and update css import in Javascript'
      )
    })
  })

  describe('builder', () => {
    it('should be a function', () => {
      assert.equal(typeof builder, 'function')
    })
  })

  describe('handler', () => {
    it('should be a function', () => {
      assert.equal(typeof handler, 'function')
    })
  })
})
