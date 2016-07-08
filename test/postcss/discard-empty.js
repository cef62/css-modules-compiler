import assert from 'assert'
import postcss from 'postcss'

import discardEmpty from '../../src/postcss/discard-empty'

describe('discardEmpty', () => {
  it('works', () => {
    const input = `
      .foo {
        color: red;
      }
      .bar { }
    `
    const output = `
      .foo {
        color: red;
      }
    `

    return postcss([discardEmpty()]).process(input).then(result => {
      assert.deepEqual(result.css, output)
      assert.deepEqual(result.warnings().length, 0)
    })
  })
})
