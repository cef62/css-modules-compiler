[![build status](https://img.shields.io/travis/cef62/css-modules-compiler/master.svg?style=flat-square)](https://travis-ci.org/cef62/css-modules-compiler) [![npm version](https://img.shields.io/npm/v/css-modules-compiler.svg?style=flat-square)](https://www.npmjs.com/package/css-modules-compiler) [![npm downloads](https://img.shields.io/npm/dm/css-modules-compiler.svg?style=flat-square)](https://www.npmjs.com/package/css-modules-compiler) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## Css Modules Compiler

The compiler is a small autonomous node module that can be used programmatically from Javascript or directly from the CLI. To use the module is enough to invoke it passing a source folder, the folder will be traversed and all the css files will be compiled as `css-modules`, all the generated css files will be merged, deduped and optimized in a single css file. All the `es2015` modules will be checked using an AST parser and all the `css` import declaration will be substituted with a static object containing the generated css classnames.
The compile command accepts several options: postcss plugins to be used when compiling css files, a blacklist of patterns used to avoid compilation of non `css-modules` files, a target folder to duplicate the source and avoid changing the original sources and more.

## Documentation

See the [official documentation](https://cef62.github.io/css-modules-compiler)

## Tests

```
$ npm test
```

## Try it

To try the module clone the repository, install `npm` dependencies and then run the following commands to see it in action.

```
npm run examples:basic
``` 

```
npm run examples:advanced
``` 



