#!/usr/bin/env node

const { echo, exit } = require('shelljs')
const { clean, prepare, build, watch, publish } = require('./api/docs')
const defaults = require('../defaults.json')
const {
  action,
  repo = defaults.repo,
} = require('yargs').option('a', {
  alias: 'action',
  demand: true,
  requiresArg: true,
  describe: 'Type of action to execute ',
  choices: ['clean', 'prepare', 'build', 'watch', 'publish'],
  type: 'string',
})
.option('r', {
  alias: 'repo',
  requiresArg: true,
  describe: 'Complete name of github repository (user/repo)',
  type: 'string',
}).argv

const actions = new Map([
  ['clean', () => clean()],
  ['prepare', () => prepare()],
  ['build', () => build(repo)],
  ['watch', () => watch()],
  ['publish', () => publish(repo)],
])

if (!actions.has(action)) {
  echo(`The given action: [${action}] is not valid, see usage help.`)
  exit(1)
} else {
  actions.get(action)()
    .then(() => exit(0))
    .catch((err) => {
      echo(err)
      exit(1)
    })
}
