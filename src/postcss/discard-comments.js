const postcss = require('postcss')

const msg = { type: 'removal', plugin: 'postcss-discard-comments' }

const discardComments = (css, result) => {
  css.each((node) => {
    if (node.type === 'comment') {
      node.remove()
      result.messages.push(Object.assign({}, msg, { node }))
    }
  })
}

module.exports = postcss.plugin('postcss-discard-comments', () => (css, result) => discardComments(css, result))
