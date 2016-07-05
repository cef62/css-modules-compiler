const path = require('path')
const { compileCss } = require('./src/css-modules-compiler')

compileCss(path.join('build'))
  .then((res) => console.log('COMPILED'))
  .catch((res) => console.log(`Error: ${res}`))
