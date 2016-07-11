const simplePlugin = require('./simple-plugin')
const otherPlugin = require('./other-plugin')

module.exports = () => [simplePlugin, otherPlugin]
