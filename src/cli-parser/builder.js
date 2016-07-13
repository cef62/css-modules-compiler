module.exports = (yargs) => yargs
  .usage('$0 -s <source folder> -t <target folder> -n <output name> -p <plugin modules>')
  .option('s', {
    alias: 'source',
    demand: true,
    requiresArg: true,
    describe: 'Source folder to be processed, can be a relative or an absolute path.',
    type: 'string',
  })
  .option('t', {
    alias: 'target',
    requiresArg: true,
    describe: 'Target folder, if defined the source folder will be copied to the given '
      + 'path and the modules will process the duplicated folder.',
    type: 'string',
  })
  .option('p', {
    alias: 'plugins',
    requiresArg: true,
    describe: 'Space separated string of names of npm postcss plugins.'
      + ' This parameter must be defined as last.',
    type: 'array',
  })
  .option('plugins-config', {
    alias: 'pconf',
    requiresArg: true,
    describe: 'Path to a node module invoked at runtime to receive a list of plugins.'
      + 'The modules must export a function.',
    normalize: true,
    type: 'string',
  })
  .option('n', {
    alias: 'name',
    requiresArg: true,
    describe: 'Name for the generated css file, default to styles.css',
    type: 'string',
    default: 'styles.css',
  })
  .option('b', {
    alias: 'blacklist',
    requiresArg: true,
    describe: 'Space separated sequence of patterns used to filter css files from compilation.',
    type: 'array',
  })
