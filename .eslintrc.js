const baseConfig = require('ts-standardx/.eslintrc.js')
const { mergeObj } = require('standard-engine-ts')

module.exports = mergeObj(baseConfig, {
  env: {
    es2021: true,
    mocha: true
  }
})
