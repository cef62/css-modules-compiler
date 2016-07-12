/* eslint-disable no-underscore-dangle */
import assert from 'assert'
import { pathMock, fsMock } from './helpers'
import getPlugins from '../../src/cli-parser/get-plugins'

getPlugins.__Rewire__('path', pathMock)

describe('CLI parser', () => {
  describe('get-plugins', () => {
    it('should return undefined if invoked without arguments', () => {
      getPlugins.__Rewire__('fs', fsMock())
      assert.ifError(getPlugins())
    })

    it('should return an error message if postcss config module doesn\'t exist', () => {
      getPlugins.__Rewire__('fs', fsMock())

      const res = getPlugins('postcss-plugins-config')
      const fullPath = `${process.cwd()}/postcss-plugins-config`

      assert.equal(
        res,
        `Module '${fullPath}' doesn't exist or isn't a valid module.`
      )
    })

    it('should return an error message if postcss config module doesn\'t return an array', () => {
      getPlugins.__Rewire__('fs', fsMock())

      const target = 'test/cli-parser/fixtures/postcss-plugins-config-fail'
      const res = getPlugins(target)
      const fullPath = `${process.cwd()}/${target}`

      assert.equal(
        res,
        `Module '${fullPath}' doesn't exist or isn't a valid module.`
      )
    })

    it('should return an array of module returned from given config module', () => {
      getPlugins.__Rewire__('fs', fsMock())

      const target = 'test/cli-parser/fixtures/postcss-plugins-config-success'
      const res = getPlugins(target)

      assert.ok(Array.isArray(res))
      assert.equal(res[0], 'plugin-a')
    })

    it('should return an error message if some of the postcss modules names doesn\'t exist', () => {
      getPlugins.__Rewire__('fs', fsMock())

      const res = getPlugins(null, ['plugin-a', 'plugin-b'])
      assert.equal(res, `Cannot find module 'plugin-a'`)
    })

    it('should return an array of module returned from given postcss modules names', () => {
      getPlugins.__Rewire__('fs', fsMock())

      const plugins = [
        `${process.cwd()}/test/cli-parser/fixtures/postcss-plugins-config-success`,
        `./test/cli-parser/fixtures/postcss-plugins-config-success-other`,
      ]
      const res = getPlugins(null, plugins)

      assert.ok(Array.isArray(res), 'minni')
      assert.equal(res[0], 'plugin-a')
      assert.equal(res[1], 'plugin-other')
    })
  })
})
