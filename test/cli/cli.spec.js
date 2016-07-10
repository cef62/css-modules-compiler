import fs from 'fs'
import path from 'path'
import del from 'del'
import assert from 'assert'
import sh from 'shelljs'
import Promise from 'bluebird'

const exec = (code, errorMsg = 'Something went wrong', silent = false) =>
  new Promise((resolve, reject) => {
    sh.exec(code, { silent }, (errorCode, stdout, stderr) => {
      if (errorCode) {
        reject(stderr || errorMsg)
      }
      resolve()
    })
  })

const root = path.join(__dirname, `.`)
const cli = path.resolve(path.join(root, '..', '..', 'bin', 'css-modules-compiler.js'))

const targetFolders = [
  `${root}/basic/fixtures/build`,
  `${root}/blacklist/fixtures/build`,
]

describe('compiler CLI', () => {
  beforeEach(() => del(targetFolders))

  it('should works with required parameters only (short options)', () => {
    const targetFolder = targetFolders[0]
    const expectedStyles = fs.readFileSync(`${root}/basic/expected/styles.css`, 'utf8')
    const expectedApp = require(`${root}/basic/expected/app.js`)(targetFolder)

    const sourceFolder = `${root}/basic/fixtures/src`
    const command = `${cli} -s ${sourceFolder} -t ${targetFolder}`

    return exec(command).then(() => {
      const styles = fs.readFileSync(`${targetFolder}/styles.css`, 'utf8')
      const app = fs.readFileSync(`${targetFolder}/app.js`, 'utf8')

      assert.equal(styles, expectedStyles)
      assert.equal(app, expectedApp)
    })
  })

  it('should works with required parameters only (long otpions)', () => {
    const targetFolder = targetFolders[0]
    const expectedStyles = fs.readFileSync(`${root}/basic/expected/styles.css`, 'utf8')
    const expectedApp = require(`${root}/basic/expected/app.js`)(targetFolder)

    const sourceFolder = `${root}/basic/fixtures/src`
    const command = `${cli} --source ${sourceFolder} --target ${targetFolder}`

    return exec(command).then(() => {
      const styles = fs.readFileSync(`${targetFolder}/styles.css`, 'utf8')
      const app = fs.readFileSync(`${targetFolder}/app.js`, 'utf8')

      assert.equal(styles, expectedStyles)
      assert.equal(app, expectedApp)
    })
  })

  it('should allows to change the output css filename', () => {
    const targetFolder = targetFolders[0]
    const expectedStyles = fs.readFileSync(`${root}/basic/expected/styles.css`, 'utf8')
    const expectedApp = require(`${root}/basic/expected/app.js`)(targetFolder)

    const sourceFolder = `${root}/basic/fixtures/src`
    const command = `${cli} -s ${sourceFolder} -t ${targetFolder} -n my-style.css`

    return exec(command).then(() => {
      const styles = fs.readFileSync(`${targetFolder}/my-style.css`, 'utf8')
      const app = fs.readFileSync(`${targetFolder}/app.js`, 'utf8')

      assert.equal(styles, expectedStyles)
      assert.equal(app, expectedApp)
    })
  })

  it('should support blacklisting of css files using an array of globs', () => {
    const targetFolder = targetFolders[1]
    const sourceFolder = `${root}/blacklist/fixtures/src`
    const expectedStyles = fs.readFileSync(`${root}/blacklist/expected/styles.css`, 'utf8')
    const expectedApp = require(`${root}/blacklist/expected/app.js`)(targetFolder)

    const expectedIgnoredFileOne = fs.readFileSync(`${sourceFolder}/styles.global.css`, 'utf8')
    const expectedIgnoredFileTwo = fs.readFileSync(`${sourceFolder}/css/styles.ignore.css`, 'utf8')

    const command = `${cli} -s ${sourceFolder} -t ${targetFolder} -b *.global.css *.ignore.css`

    return exec(command).then(() => {
      const styles = fs.readFileSync(`${targetFolder}/styles.css`, 'utf8')
      const app = fs.readFileSync(`${targetFolder}/app.js`, 'utf8')

      const ignoredFileOne = fs.readFileSync(`${targetFolder}/styles.global.css`, 'utf8')
      const ignoredFileTwo = fs.readFileSync(`${targetFolder}/css/styles.ignore.css`, 'utf8')

      assert.equal(styles, expectedStyles)
      assert.equal(app, expectedApp)
      assert.equal(expectedIgnoredFileOne, ignoredFileOne)
      assert.equal(expectedIgnoredFileTwo, ignoredFileTwo)
    })
  })
  // TODO: missing post-css plugins configurations tests
})
