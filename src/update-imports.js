const path = require('path')
const Promise = require('bluebird')
const fs = Promise.promisifyAll(require('fs'))
const parse = require('babylon').parse
const traverse = require('babel-traverse').default
const t = require('babel-types')
const template = require('babel-template')
const generate = require('babel-generator').default

const chalk = require('chalk')
const debug = require('debug')('cmc:updater')
const error = require('debug')('cmc:updater:error')

const buildStaticCssReference = template('const IMPORT_NAME = SOURCE')

const traverseCode = (ast, currentFileFolder, contentsMap) =>
  new Promise((resolve, reject) => {
    let mutated = false

    traverse(ast, {
      ImportDeclaration(traversedPath) {
        if (traversedPath.node.specifiers.length === 1 &&
          t.isImportDefaultSpecifier(traversedPath.node.specifiers[0])) {
          // retrieve the name of the variable assigned to the imported css
          const importName = traversedPath.node.specifiers[0].local.name

          // resolve the real import path
          const sourceName = path.resolve(currentFileFolder, traversedPath.node.source.value)

          if (!contentsMap.has(sourceName)) {
            error(`No static content received for import of ${chalk.inverse.bold('sourceName')}`)
          } else {
            debug(`-- ${chalk.inverse(sourceName)}`)

            // array of ObjectProperty instances
            const staticContent = contentsMap.get(sourceName)

            // change the node from a css import to static content
            const newAst = buildStaticCssReference({
              ORIGIN: t.stringLiteral(sourceName),
              IMPORT_NAME: t.identifier(importName),
              SOURCE: t.objectExpression(staticContent),
            })

            // replace the origina impot with the static css map
            traversedPath.replaceWith(newAst)

            // eslint-disable-next-line no-param-reassign
            traversedPath.node.leadingComments = [{
              type: 'CommentLine',
              value: ` original css file: ${sourceName}`,
            }]

            // flag the AST to be recompiled
            mutated = true
          }
        }
      },
    })

    if (mutated) {
      resolve()
    } else {
      debug(`-- No css imports found!`)
      reject()
    }
  })

const updateCssImports = (file, contentsMap) => {
  const currentFileFolder = path.dirname(file)

  // read given file contents
  return fs.readFileAsync(file, 'utf8')
    .then((code) => {
      // parse code to AST
      const ast = parse(code, {
        // parse in strict mode and allow module declarations
        sourceType: 'module',
        // enable jsx and flow syntax
        plugins: ['jsx', 'flow'],
      })

      debug(`Search for css-modules imports in: ${chalk.red.bold(file)}`)

      // traverse the AST searching for css import statements
      return traverseCode(ast, currentFileFolder, contentsMap)
        .then(() => generate(ast, {}, code).code)
        .catch(() => false)
    })
}

module.exports = { updateCssImports }
