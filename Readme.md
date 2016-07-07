## Attention

The module is still in active development, APIs may change often.

## Css Modules Compiler

The module take a folder of javascript sources using css-modules, optionally clone it, and then
compile all the scoped css in a single file. The original css files are deleted and all the import
in javascript files are substituted with static map generated with the css-modules compilation.

## Tests

Currently tests are broken

## Try it

To try the lib clone the repository, install `npm` deps and run

```
./bin/css-modules-compiler.js -s tmp -t build -n final.css
```

The `tmp` folder will be copied to `build` and then processed.
