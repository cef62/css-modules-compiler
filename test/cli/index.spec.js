/* eslint-disable no-underscore-dangle */
import assert from 'assert'
import { builder, command, describe as describeCommand, handler } from '../../src/cli-parser'

describe('CLI parser', () => {
  it('.command should equal to `compile`', () => {
    assert.equal(command, 'compile')
  })

  it('.describe should equal to '
    + '`Compile css-modukes to a single css file and update css import in Javascript`',
  () => {
    assert.equal(
      describeCommand,
      'Compile css-modukes to a single css file and update css import in Javascript'
    )
  })

  it('.builder should be a function', () => {
    assert.equal(typeof builder, 'function')
  })

  it('.handler should be a function', () => {
    assert.equal(typeof handler, 'function')
  })
})
