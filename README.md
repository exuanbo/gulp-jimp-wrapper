# gulp-jimp-wrapper

> Manipulates images using [Jimp](https://www.npmjs.com/package/jimp).

[![npm](https://img.shields.io/npm/v/gulp-jimp-wrapper?style=flat-square)](https://www.npmjs.com/package/gulp-jimp-wrapper)
[![Travis CI](https://img.shields.io/travis/com/exuanbo/gulp-jimp-wrapper/master?style=flat-square)](https://travis-ci.com/github/exuanbo/gulp-jimp-wrapper)
[![Codecov](https://img.shields.io/codecov/c/gh/exuanbo/gulp-jimp-wrapper?style=flat-square)](https://codecov.io/gh/exuanbo/gulp-jimp-wrapper)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/gulp-jimp-wrapper?style=flat-square)](https://libraries.io/npm/gulp-jimp-wrapper)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen?style=flat-square)](https://renovatebot.com/)

## Install

```bash
npm install --save-dev gulp-jimp-wrapper
```

## Usage

```javascript
const { src, dest } = require('gulp')
const jimp = require('gulp-jimp-wrapper')

exports.default = () => {
  return src('./src/img/*')
    .pipe(
      jimp(image => image.resize(256, 256).quality(60).greyscale(), {
        extname: '.min.png'
      })
    )
    .pipe(dest('./dist/img'))
}
```

or use ES module

```javascript
import jimp from 'gulp-jimp-wrapper'
```

## API


```ts
type Callback = (image: Jimp ) => Jimp
interface Options = { basename?: string, extname?: string }

declare const gulpJimp: (cb: Callback, opts?: Options) => stream.Transform
```


See [jimp #methods](https://www.npmjs.com/package/jimp#methods) for the full documentation.

Note that `basename` option should only be used when `gulp.src()` takes in one single file.

Be careful with the `Jimp.write()` method.

## License

[MIT License](https://github.com/exuanbo/gulp-jimp-wrapper/blob/master/LICENSE) © 2020 [Exuanbo](https://github.com/exuanbo)
