import fs from 'fs'
import path from 'path'
import assert from 'assert'
import atImport from 'postcss-import'

import { extract } from '../../src/extractor'

const test = (type, blacklist = [], ...plugins) => {
  describe(type, () => {
    it('works', () => {
      const root = path.join(__dirname, `./${type}`)
      const styles = fs.readFileSync(`${root}/expected/styles.css`)
      const map = require(`${root}/expected/map.js`)(`${root}/fixtures`)

      return extract(`${root}/fixtures/app`, blacklist, ...plugins).then(result => {
        assert.equal(result.styles, styles.toString())
        assert.deepEqual(result.map, map)
      })
    })
  })
}

describe('extract', () => {
  test('basic')
  test('blacklist', ['*.global.css'])
  test('composes')
  test('optimize')
  test('plugins', [], atImport())
})
