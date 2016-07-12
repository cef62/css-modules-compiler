const handler = require('./handler')
const builder = require('./builder')
const command = 'compile'
const describe = 'Compile css-modukes to a single css file and update css import in Javascript'

module.exports = { builder, command, describe, handler }
