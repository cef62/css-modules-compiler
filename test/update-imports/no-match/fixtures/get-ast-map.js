const t = require('babel-types')

const source = {
  [`${__dirname}/bar.css`]: {
    btn: '_caps_pw0m0_17 _m1_pw0m0_89 _border_pw0m0_74',
  },
}

const convertCssMapToAst = (map) =>
  Object.keys(map).map((key) =>
    t.objectProperty(t.identifier(key), t.stringLiteral(map[key]))
  )

const convertCssMapToAstMap = (map) => Object.keys(map)
  .reduce((acc, key) => acc.set(key, convertCssMapToAst(map[key])), new Map())

export default function getAstMap() {
  return convertCssMapToAstMap(source)
}
