'use strict'

const path = require('path')
const through = require('through2')
const PluginError = require('plugin-error')
const jimp = require('jimp')

const PLUGIN_NAME = 'gulp-jimp-wrapper'
const supportedMimetypes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  gif: 'image/gif'
}

const processImg = (img, cb) =>
  new Promise((resolve, reject) => {
    const extension = path
      .extname(img.path)
      .split('.')
      .pop()

    jimp
      .read(img.contents)
      .then(cb)
      .then(img => img.getBufferAsync(supportedMimetypes[extension]))
      .then(data => resolve(data))
      .catch(err => reject(err))
  })

const jimpWrapper = cb => {
  return through.obj(async (img, _, callback) => {
    try {
      if (img.isNull()) {
        return callback(null, img)
      }

      if (img.isStream()) {
        return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      }

      if (typeof cb !== 'function') {
        return callback(
          new PluginError(PLUGIN_NAME, `Argument '${cb}' is not a function`)
        )
      }

      const data = await processImg(img, cb)
      img.contents = Buffer.from(data)
      callback(null, img)
    } catch (err) {
      callback(new PluginError(PLUGIN_NAME, err))
    }
  })
}

module.exports = jimpWrapper
