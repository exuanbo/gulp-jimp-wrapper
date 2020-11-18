const baseConfig = require('ts-standardx/.eslintrc.js')
const { mergeObj } = require('standard-engine-ts')

module.exports = mergeObj(baseConfig, {
  env: {
    mocha: true
  },
  parser: 'espree',
  parserOptions: {
    ecmaVersion: 12
  }
})
