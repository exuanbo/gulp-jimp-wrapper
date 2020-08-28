# gulp-jimp-wrapper

> Manipulates images using [Jimp](https://www.npmjs.com/package/jimp).

[![npm](https://img.shields.io/npm/v/gulp-jimp-wrapper.svg?style=flat-square)](https://www.npmjs.com/package/gulp-jimp-wrapper)
[![Travis CI](https://img.shields.io/travis/com/exuanbo/gulp-jimp-wrapper/master.svg?style=flat-square)](https://travis-ci.com/github/exuanbo/gulp-jimp-wrapper)
[![David](https://img.shields.io/david/exuanbo/gulp-jimp-wrapper.svg?style=flat-square)](https://david-dm.org/exuanbo/gulp-jimp-wrapper)
[![License](https://img.shields.io/github/license/exuanbo/gulp-jimp-wrapper.svg?style=flat-square)](https://github.com/exuanbo/gulp-jimp-wrapper/blob/master/LICENSE)

This plugin is actively maintained with the help of [Renovate](https://github.com/marketplace/renovate).

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
    .pipe(jimp(image =>
      image
        .resize(256, 256)
        .quality(60)
        .greyscale()
    ))
    .pipe(dest('dist/img'))
})
```

or you can

```javascript
import jimp from 'gulp-jimp-wrapper'
```

## Options

`gulp-jimp-wrapper` takes in a callback function in which methods of `Jimp` can be called. See [Jimp#Methods](https://www.npmjs.com/package/jimp#methods) for full documentation.

Currently this plugin does not support changing name or extention of the image. Be careful with the `image.write()` method.

## License

[MIT](https://github.com/exuanbo/gulp-jimp-wrapper/blob/master/LICENSE)

## Donate

<a href="https://www.buymeacoffee.com/exuanbo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/lato-orange.png" alt="Buy Me A Coffee" height="38.25px" width="162.75px"></a>
