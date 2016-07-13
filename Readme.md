[![build status](https://img.shields.io/travis/cef62/css-modules-compiler/master.svg?style=flat-square)](https://travis-ci.org/cef62/css-modules-compiler) [![npm version](https://img.shields.io/npm/v/css-modules-compiler.svg?style=flat-square)](https://www.npmjs.com/package/css-modules-compiler) [![npm downloads](https://img.shields.io/npm/dm/css-modules-compiler.svg?style=flat-square)](https://www.npmjs.com/package/css-modules-compiler) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Css Modules Compiler

The module take a folder of javascript sources using css-modules, optionally clone it, and then
compile all the scoped css in a single file. The original css files are deleted and all the import
in javascript files are substituted with static map generated with the css-modules compilation.

## Tests

```
npm test
```

## Try it

To try the lib clone the repository, install `npm` deps and run

```
./bin/css-modules-compiler.js -s tmp -t build -n final.css
```

The `tmp` folder will be copied to `build` and then processed.

