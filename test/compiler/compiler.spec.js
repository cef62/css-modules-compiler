import fs from 'fs'
import path from 'path'
import del from 'del'
import assert from 'assert'

import { compileCss } from '../../src/compiler'

describe('compiler', () => {
  const root = path.join(__dirname, `.`)
  const targetFolder = `${root}/fixtures/build`

  beforeEach(() => del(targetFolder))

  it('works', () => {
    const expectedStyles = fs.readFileSync(`${root}/expected/style.css`)
    const expectedApp = require(`${root}/expected/app.js`)(targetFolder)

    return compileCss(`${root}/fixtures/src`, { targetFolder }).then(() => {
      const styles = fs.readFileSync(`${targetFolder}/style.css`)
      const app = fs.readFileSync(`${targetFolder}/app.js`)

      assert.equal(styles.toString(), expectedStyles.toString())
      assert.equal(app.toString(), expectedApp)
    })
  })
})
