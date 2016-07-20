# FAQ

### Can I use the module with other bundlers (Webpack, Rollup, Browserify, etc...)

Currently is not possible to use the module as plugin for bundlers tools. We aim to support Webpack as soon as possible, support for other tools will follow.

### Can I use the module with Gulp

Yes but partially. `ccs.modules-compiler` is a simple node module and thus can be used inside any Gulp task. The module at the moment is not available as Gulp plugin therefore can't be used inside a Gulp stream.

### Which version of Node.js is supported

Currently we support only `Node 6.x` or higher because the module is written using several `es2015` features.