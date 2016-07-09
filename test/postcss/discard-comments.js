import assert from 'assert'
import postcss from 'postcss'

import discardComments from '../../src/postcss/discard-comments'

describe('discardComments', () => {
  it('works', () => {
    const input = `
      /* comments, comments everywhere */
      .foo {
        color: red;
      }
    `
    const output = `
      .foo {
        color: red;
      }
    `

    return postcss([discardComments()]).process(input).then(result => {
      assert.deepEqual(result.css, output)
      assert.deepEqual(result.warnings().length, 0)
    })
  })
})
