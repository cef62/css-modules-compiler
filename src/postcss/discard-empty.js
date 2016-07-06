const postcss = require('postcss')

const msg = { type: 'removal', plugin: 'postcss-discard-empty' }

const discardEmpty = (css, result) => {
  const discard = (node) => {
    const { type, nodes, params, selector, value } = node

    if (nodes) {
      node.each(discard)
    }

    const remove = type === 'decl' && !value
      || type === 'rule' && !selector
      || nodes && !nodes.length
      || type === 'atrule' && (!nodes && !params || !params && !nodes.length)

    if (remove) {
      node.remove()
      result.messages.push(Object.assign({}, msg, { node }))
    }
  }
  css.each(discard)
}

module.exports = postcss.plugin(
  'postcss-discard-empty',
  () => (css, result) => discardEmpty(css, result)
)
