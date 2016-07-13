#!/usr/bin/env node

/* eslint-disable no-unused-expressions */
require('yargs')
  .command(require('../src/cli-parser'))
  .help()
  .argv
