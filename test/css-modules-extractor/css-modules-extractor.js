import fs from 'fs'
import path from 'path'
import assert from 'assert'
import atImport from 'postcss-import'

import { extract } from '../../src/css-modules-extractor'

describe('extract', () => {
  describe('basic', () => {
    const styles = fs.readFileSync(path.join(__dirname, './basic/expected/styles.css'))
    const map = fs.readFileSync(path.join(__dirname, './basic/expected/map.json'))

    it('works', done => {
      extract(path.join(__dirname, './basic/fixtures'))
        .then(result => {
          assert.equal(result.styles, styles.toString())
          assert.deepEqual(result.map, JSON.parse(map))
        })
        .then(done, done)
    })
  })

  describe('composes', () => {
    const styles = fs.readFileSync(path.join(__dirname, './composes/expected/styles.css'))
    const map = fs.readFileSync(path.join(__dirname, './composes/expected/map.json'))

    it('works', done => {
      extract(path.join(__dirname, './composes/fixtures/app'))
        .then(result => {
          assert.equal(result.styles, styles.toString())
          assert.deepEqual(result.map, JSON.parse(map))
        })
        .then(done, done)
    })
  })

  describe('plugins', () => {
    const styles = fs.readFileSync(path.join(__dirname, './plugins/expected/styles.css'))
    const map = fs.readFileSync(path.join(__dirname, './plugins/expected/map.json'))

    it('works', done => {
      extract(path.join(__dirname, './plugins/fixtures/app'), atImport())
        .then(result => {
          assert.equal(result.styles, styles.toString())
          assert.deepEqual(result.map, JSON.parse(map))
        })
        .then(done, done)
    })
  })
})
