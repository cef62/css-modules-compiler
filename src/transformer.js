const t = require('babel-types')

const convertCssMapToAst = (map) =>
  Object.keys(map).map((key) => t.objectProperty(t.identifier(key), t.stringLiteral(map[key])))

const convertCssMapToAstMap = (map) =>
  Object.keys(map).reduce((acc, key) => acc.set(key, convertCssMapToAst(map[key])), new Map())

module.exports = { convertCssMapToAstMap }
