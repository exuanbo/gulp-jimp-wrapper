const pkg = require('./package.json')
const commonjs = require('@rollup/plugin-commonjs')

export default {
  input: 'index.js',
  plugins: [commonjs()],
  external: ['path', ...Object.keys(pkg.dependencies)],
  output: {
    file: pkg.module,
    format: 'es'
  }
}
