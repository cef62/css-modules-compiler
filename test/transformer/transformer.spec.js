import assert from 'assert'

import { convertCssMapToAstMap } from '../../src/transformer'

describe('transformer', () => {
  describe('convertCssMapToAstMap', () => {
    it('works', () => {
      const cssMap = {
        'foo.css': {
          foo: 'bar',
        },
      }

      const astMap = convertCssMapToAstMap(cssMap)

      const expected = [{
        type: 'ObjectProperty',
        key: {
          type: 'Identifier',
          name: 'foo',
        },
        value: {
          type: 'StringLiteral',
          value: 'bar',
        },
        computed: false,
        shorthand: false,
        decorators: null,
      }]

      assert.deepEqual(astMap.get('foo.css'), expected)
    })
  })
})
