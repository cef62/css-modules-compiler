const path = require('path')
const sh = require('shelljs')
const { cleanFolders, exec } = require('./helpers')

const execFolder = process.cwd()
const gitbookCli = path.join(execFolder, 'node_modules', '.bin', 'gitbook')

const clean = () => cleanFolders(`_book`)

const prepare = () => exec(
  `${gitbookCli} install`,
  `Something went wrong preparing gitbook install.`
)

const build = (repo) => prepare()
  .then(() => exec(
    `${gitbookCli} build -g ${repo}`,
    `Something went wrong while building gitbook for '${repo}'.`
  ))

const watch = () => prepare()
  .then(() => exec(
    `${gitbookCli} serve`,
    `Something went wrong while serving gitbook to localhost.`
  ))

const publish = (repo) => {
  let cwd
  return clean()
    .then(() => build())
    .then(() => { cwd = sh.pwd() })
    .then(() => sh.cd(path.join(execFolder, '_book')))
    .then(() => exec(
      `git init`,
      `Something went wrong initializing git repo for the docs.`
    ))
    .then(() => exec(
      `git commit --allow-empty -m 'chore(docs): update gitbook'`,
      `Something went wrong creating book empty commit.`
    ))
    .then(() => exec(
      `git checkout -b gh-pages`,
      `Something went wrong creating 'gh-pages' branch.`
    ))
    .then(() => exec(
      `touch .nojekyll`,
      `Impossible create a .nojekyll file.`
    ))
    .then(() => exec(
      `git add .`,
      `Impossible adding files to the git index.`
    ))
    .then(() => exec(
      `git commit -am 'chore(docs): update gitbook'`,
      `Someting went wrong committing the docs to git index.`
    ))
    .then(() => exec(
      `git push git@github.com:${repo} gh-pages --force`,
      `Something went wrong pushing the docs to github`
    ))
    .then(() => sh.cd(cwd))
}

module.exports = {
  clean,
  prepare,
  build,
  watch,
  publish,
}
