import assert from 'assert'
import postcss from 'postcss'

import discardDuplicates from '../../src/postcss/discard-duplicates'

describe('discardDuplicates', () => {
  it('works', () => {
    const input = `
      .foo {
        color: red;
      }
      .foo {
        color: red;
      }
    `
    const output = `
      .foo {
        color: red;
      }
    `

    return postcss([discardDuplicates()]).process(input).then(result => {
      assert.deepEqual(result.css, output)
      assert.deepEqual(result.warnings().length, 0)
    })
  })
})
