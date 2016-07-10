import path from 'path'
import assert from 'assert'

import { updateCssImports } from '../../src/update-imports'

const test = (folder, desc, msg, assertions) => {
  describe(desc, () => {
    it(msg, () => {
      const root = path.join(__dirname, `./${folder}`)
      const file = `${root}/fixtures/foo.js.txt`
      const output = require(`./${folder}/expected/get-expected`)()
      const astMap = require(`./${folder}/fixtures/get-ast-map`)()

      return updateCssImports(file, astMap).then((result) => {
        assertions(result, output)
      })
    })
  })
}

describe('Update import,', () => {
  test('basic', 'Basic import', 'should return updated js code', (res, output) => {
    assert.equal(res, output)
  })
  test('no-match', 'No match', 'should return false', (res) => {
    assert.ifError(res)
  })
  test('no-import', 'No css imports in file', 'should return false', (res) => {
    assert.ifError(res)
  })
})
