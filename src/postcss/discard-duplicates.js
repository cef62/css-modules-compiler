const postcss = require('postcss');

const ROOT = 'root'
const msg = { type: 'removal', plugin: 'postcss-discard-duplicates' }

const discardDuplicates = (css, result) => {
  const cache = new Set()

  // remove exact duplicates rules
  css.walkRules((node) => {
    // ignore atRules and comments nodes
    if (node.parent.type === ROOT) {
      // create a unique literal for the rule
      const nodeLiteral = node.toString().replace(/(\s{2,})|(\r)|(\n)/gm, ' ')

      // if th eliteral is already stored remove the duplicate, otherwise store it
      if(cache.has(nodeLiteral)) {
        node.remove()
        result.messages.push(Object.assign({}, msg, { node }))
      } else {
        cache.add(nodeLiteral)
      }
    }
  })

  // remove exact duplicates atRules and duplicates rules for equals atRules definitions
  cache.clear()
  const mqCache = new Map()

  css.walkAtRules((node) => {
    const atRuleId = node.params.replace(/(\s{2,})|(\r)|(\n)/gm, ' ')
    const nodeLiteral = node.toString().replace(/(\s{2,})|(\r)|(\n)/gm, ' ')

    // first check if exists an identical atRule block
    let checkChildren = true
    if(cache.has(nodeLiteral) || !node.nodes.length) {
      checkChildren = false
      node.removeAll()
      node.remove()
      result.messages.push(Object.assign({}, msg, { node }))
    } else {
      // add to literal cache
      cache.add(nodeLiteral)

      if (mqCache.has(atRuleId)) {
        checkChildren = false
      } else {
        // add children to mq cache
        const children = node.nodes.reduce(
          (acc, n) => acc.add(n.toString().replace(/(\s{2,})|(\r)|(\n)/gm, ' ')),
          new Set()
        )
        mqCache.set(atRuleId, children)
      }
    }

    // TODO; this part of the code requires further test and optimizations
    // if no exact match exist we search for children nodes duplication
    if (!checkChildren) {
      const nodes = mqCache.get(atRuleId)
      node.nodes.forEach((n) => {
        const ruleId = n.toString().replace(/(\s{2,})|(\r)|(\n)/gm, ' ')
        if (nodes.has(ruleId)) {
          node.removeChild(n)
        } else {
          nodes.add(ruleId)
        }
      })
    }
  })

}

module.exports = postcss.plugin('postcss-discard-duplicates', () => discardDuplicates)

