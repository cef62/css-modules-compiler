# CLI

```shell
$ css-modules-compiler.js compile --help

Usage
    css-modules-compiler.js -s <source folder> -t <target folder> -n <output name> -p <plugin modules>

Options:
  --help                     Show help [boolean]
  -s, --source               Source folder to be processed, can be a relative or an absolute path. [string] [required]
  -t, --target               Target folder, if defined the source folder will be copied to the given path and the modules will process the duplicated folder. [string]
  -p, --plugins              Space separated string of names of npm postcss
                             plugins. This parameter must be defined as last. [array]
  --plugins-config, --pconf  Path to a node module invoked at runtime to receive a list of plugins. The modules must export a function. [string]
  -n, --name                 Name for the generated css file, defaults to styles.css [string] [default: "styles.css"]
  -b, --blacklist            Space separated sequence of patterns used to filter css files from compilation. [array]
```
