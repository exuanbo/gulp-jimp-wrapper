# gulp-jimp-wrapper

> Manipulates images using [Jimp](https://www.npmjs.com/package/jimp).

[![npm](https://img.shields.io/npm/v/gulp-jimp-wrapper?style=flat-square)](https://www.npmjs.com/package/gulp-jimp-wrapper)
[![Travis CI](https://img.shields.io/travis/com/exuanbo/gulp-jimp-wrapper/master?style=flat-square)](https://travis-ci.com/github/exuanbo/gulp-jimp-wrapper)
[![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/gulp-jimp-wrapper?style=flat-square)](https://libraries.io/npm/gulp-jimp-wrapper)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen?style=flat-square)](https://renovatebot.com/)

## Install

```bash
npm install --save-dev gulp-jimp-wrapper
```

## Usage

```javascript
const { task, src, dest } = require('gulp')
const jimp = require('gulp-jimp-wrapper')

task('jimp', () => {
  return src('img/*')
    .pipe(
      jimp(image =>
        image
          .resize(256, 256)
          .quality(60)
          .greyscale()
      )
    )
    .pipe(dest('dist/img'))
})
```

or you can

```javascript
import jimp from 'gulp-jimp-wrapper'
```

## API

`gulp-jimp-wrapper` takes in a callback function as argument where `Jimp` methods can be called. See [Jimp #Methods](https://www.npmjs.com/package/jimp#methods) for the full documentation.

By now this plugin does not support changing file name or file extention of the image. Be careful with the `image.write()` method.

## License

[MIT License](https://github.com/exuanbo/gulp-jimp-wrapper/blob/master/LICENSE) © 2020 [Exuanbo](https://github.com/exuanbo)
