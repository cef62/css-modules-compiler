# FAQ

### Can I use the module with other bundler (Webpack, Rollup, browserify, etc...)

Currently is not possible to use the module as plugin for bundlers tools. We aim to support webpack as soon as possible, support for other tools will follow.

### Can I use the module with Gulp

Yes but partially. `ccs.modules-compiler` is a simple node modules and thus can be used inside any gulp task. The module at the moment is not available as Gulp plugin therefore can't be used inside a Gulp stream.

### Which version of Node.js is supported

Currently we support only `Node 6.x` and higher because the module is written using several `es2015` features.