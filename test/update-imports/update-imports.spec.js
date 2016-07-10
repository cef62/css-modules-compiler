import path from 'path'
import assert from 'assert'

import { updateCssImports } from '../../src/update-imports'

describe('updateCssImports,', () => {
  describe('basic', () => {
    it('works', () => {
      const root = path.join(__dirname, `./basic`)
      const file = `${root}/fixtures/foo.js`
      const output = require(`${root}/expected/foo`)(`${root}/fixtures`)

      const astMap = new Map()
      astMap.set(`${root}/fixtures/foo.css`, [{
        type: 'ObjectProperty',
        key: { type: 'Identifier', name: 'bar' },
        value: {
          type: 'StringLiteral',
          value: 'baz',
        },
        computed: false,
        shorthand: false,
        decorators: null,
      }])

      return updateCssImports(file, astMap).then((result) => {
        assert.equal(result, output)
      })
    })
  })

  describe('no-import', () => {
    it('works', () => {
      const root = path.join(__dirname, `./no-import`)
      const file = `${root}/fixtures/foo.js`

      const astMap = new Map()

      return updateCssImports(file, astMap).then((result) => {
        assert.ifError(result)
      })
    })
  })

  describe('no-match', () => {
    it('works', () => {
      const root = path.join(__dirname, `./no-match`)
      const file = `${root}/fixtures/foo.js`

      const astMap = new Map()
      astMap.set(`${root}/fixtures/bar.css`, null)

      return updateCssImports(file, astMap).then((result) => {
        assert.ifError(result)
      })
    })
  })
})
