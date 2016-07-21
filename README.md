[![build status](https://img.shields.io/travis/cef62/css-modules-compiler/master.svg?style=flat-square)](https://travis-ci.org/cef62/css-modules-compiler) [![npm version](https://img.shields.io/npm/v/css-modules-compiler.svg?style=flat-square)](https://www.npmjs.com/package/css-modules-compiler) [![npm downloads](https://img.shields.io/npm/dm/css-modules-compiler.svg?style=flat-square)](https://www.npmjs.com/package/css-modules-compiler) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## CSS Modules Compiler

The compiler is a small autonomous Node.js module that can be used programmatically from JavaScript or directly from the CLI.

To use the module is enough to invoke it passing a source folder, the folder will be traversed and all the CSS files will be compiled as `css-modules`, all the generated CSS files will be merged, deduped and optimized into a single CSS file. All the `es2015` modules will be checked using an AST parser and all the `css` import declaration will be substituted with a static object containing the generated CSS class names.

The compile command accepts several options: the postcss plugins to be used when compiling css files, a blacklist of patterns used to avoid compilation of non-`css-modules` files, a target folder to duplicate the source and avoid changing the original sources and more.

## Documentation

See the [official documentation](https://cef62.github.io/css-modules-compiler)

## Install

`css-modules-compiler` is available as npm module, to use it on your project run:

```shell
npm install --save-dev css-modules-compiler
```

## Tests

```
npm test
```

## Try it

To try the module clone the repository, install `npm` dependencies and then run the following commands to see it in action.

```
npm run examples:basic
```

```
npm run examples:advanced
```
