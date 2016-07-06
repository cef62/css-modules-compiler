const path = require('path')
const { compileCss } = require('./src/css-modules-compiler')

compileCss('app', { targetFolder: 'build' })
  .then((res) => console.log('COMPILED'))
  .catch((res) => console.log(`Error: ${res}`))
