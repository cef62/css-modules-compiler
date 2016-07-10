import path from 'path'
import assert from 'assert'

import { clearJsonMap } from '../../src/optimizer'

describe('optimizer', () => {
  describe('clearJsonMap', () => {
    it('works', () => {
      const cssOutput = path.join(__dirname, './fixtures/styles.css')
      const input = {
        cssOutput,
        map: {
          [cssOutput]: {
            foo: 'foo bar',
          },
        },
      }

      const expected = {
        ...input,
        map: {
          [cssOutput]: {
            foo: 'foo',
          },
        },
      }

      return clearJsonMap(input).then((opts) => {
        assert.deepEqual(opts, expected)
      })
    })
  })
})
