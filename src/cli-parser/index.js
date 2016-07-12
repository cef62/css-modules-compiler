const handler = require('./handler')
const builder = require('./builder')
const command = 'compile'
const describe = 'Compile css-modukes to a single css file and update css import in Javascript'


exports.builder = builder
exports.handler = handler
exports.command = command
exports.describe = describe
// module.exports = { builder, command, describe, handler }
