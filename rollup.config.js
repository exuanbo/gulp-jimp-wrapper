const pkg = require('./package.json')
const commonjs = require('@rollup/plugin-commonjs')

export default {
  input: 'src/index.js',
  plugins: [commonjs()],
  external: ['path', ...Object.keys(pkg.dependencies)],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'auto'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ]
}
