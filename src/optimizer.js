const listSelectors = require('list-selectors')

const clearJsonMap = (opts) => new Promise((resolve) => {
  // retrieve css classes list
  listSelectors(opts.cssOutput, { include: ['classes'] }, (list) => {
    // remove selectors initial dot
    const selectors = list.classes.reduce((acc, sel) => acc.add(sel.slice(1)), new Set())

    /* eslint-disable no-param-reassign */
    // remove non existent classes from JSON map
    const map = Object.keys(opts.map).reduce((acc, key) => {
      // file import map
      const value = opts.map[key]

      // iterate every key of the import object
      const newValue = Object.keys(value).reduce((res, subKey) => {
        res[subKey] = value[subKey]
          .split(' ')
          .filter((className) => selectors.has(className))
          .join(' ')
        return res
      }, {})

      // store int the updated map
      acc[key] = newValue
      return acc
    }, {})
    /* eslint-enable */

    resolve(Object.assign({}, opts, { map }))
  })
})

module.exports = { clearJsonMap }
