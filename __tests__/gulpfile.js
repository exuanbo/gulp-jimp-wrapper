const { src, dest } = require('gulp')
const jimp = require('../src/index')

exports.default = () =>
  src('./img/original.jpg')
    .pipe(jimp(img => img.invert(), { basename: 'invert' }))
    .pipe(dest('./img'))
