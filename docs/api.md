# API

Currently the module exports a single public method:

## compileCss(source:string, options:object)

The method accept a source folder and a set of options to compile all css-modules found into a single css file, removing css imports declaration and substituting them with static objects of css class names.

### - source : string

Relative or absolute path to the source folder containing the css/js to be processed.

### - options : object

* **`targetFolder`** *string* Relative or absolute path to the target folder. The source folder will be copied to the given path and its contents will be compiled.
* **`targetName`** *string* Name used to create the final compiled `css` output, the extension is required. Eg. `final-output.css`
* **`plugins`** *array* List of **postcss plugins** instances ready to be passed to postcss. Eg. `[atImport(), colorFunction()]`
* **`blacklist`** *array* List of **glob pattern** used to filter some css files from css compilation. Eg. `['*.global.css', 'main.css']`