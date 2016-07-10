import fs from 'fs-extra'
import path from 'path'
import assert from 'assert'
import del from 'del'

import { updateFilesystem, cleanCss, concatenateCss, copySourceFolder } from '../../src/utils'

describe('utils', () => {
  describe('updateFilesystem', () => {
    const root = path.join(__dirname, './update-filesystem')
    const tmp = `${root}/tmp.txt`

    beforeEach(() => {
      fs.copySync(`${root}/file.txt`, tmp)
    })

    afterEach(() => del(tmp))

    it('does not update the file', () => {
      const expected = fs.readFileSync(tmp, 'utf8')

      return updateFilesystem({ tmp }).then(() => {
        const actual = fs.readFileSync(tmp, 'utf8')

        assert.equal(actual, expected)
      })
    })

    it('updates the file with code', () => {
      const code = 'bar'

      return updateFilesystem({ file: tmp, code }).then(() => {
        const actual = fs.readFileSync(tmp, 'utf8')

        assert.equal(actual, code)
      })
    })
  })

  describe('cleanCss', () => {
    const root = path.join(__dirname, './clean-css')
    const tmp = `${root}/tmp`

    beforeEach(() => {
      fs.copySync(`${root}/app`, tmp)
    })

    afterEach(() => del(tmp))

    it('works', () => {
      const input = { files: ['styles.css'] }

      return cleanCss(tmp)(input).then((opts) => {
        assert.equal(fs.existsSync(`${tmp}/${opts.files[0]}`), false)
        assert.deepEqual(input, opts)
      })
    })
  })

  describe('concatenateCss', () => {
    const root = path.join(__dirname, './concatenate-css')
    const targetName = 'styles.css'
    const cssOutput = `${root}/${targetName}`

    beforeEach(() => {
      fs.mkdirSync(root)
    })

    afterEach(() => del(root))

    it('works', () => {
      const input = { styles: '.foo { color: red; }' }

      const expected = {
        ...input,
        cssOutput,
      }

      return concatenateCss(root, targetName)(input).then((opts) => {
        const actual = fs.readFileSync(cssOutput, 'utf8')

        assert.equal(fs.existsSync(cssOutput), true)
        assert.equal(actual, input.styles)
        assert.deepEqual(opts, expected)
      })
    })
  })

  describe('copySourceFolder', () => {
    const root = path.join(__dirname, './copy-source-folder')
    const app = `${root}/app`
    const tmp = `${root}/tmp`

    afterEach(() => del(tmp))

    /* eslint-disable arrow-body-style */
    it('does not copy the folder', () => {
      return copySourceFolder(app, app).then((source) => {
        assert.equal(source, app)
      })
    })

    it('copies the folder', () => {
      return copySourceFolder(app, tmp).then((target) => {
        assert.equal(fs.existsSync(tmp), true)
        assert.equal(fs.existsSync(`${tmp}/app.js`), true)
        assert.equal(fs.existsSync(`${tmp}/.DS_Store`), false)
        assert.equal(target, tmp)
      })
    })
    /* eslint-enable */
  })
})
