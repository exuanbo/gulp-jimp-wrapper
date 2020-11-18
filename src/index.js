'use strict'

const path = require('path')
const through = require('through2')
const PluginError = require('plugin-error')
const jimp = require('jimp')

const PLUGIN_NAME = 'gulp-jimp-wrapper'
const MIME_TYPES = {
  jpeg: jimp.MIME_JPEG,
  jpg: jimp.MIME_JPEG,
  png: jimp.MIME_PNG,
  bmp: jimp.MIME_BMP,
  tiff: jimp.MIME_TIFF,
  gif: jimp.MIME_GIF
}

const pluginError = msg => new PluginError(PLUGIN_NAME, msg)

const processImage = async (img, cb) => {
  const res = await jimp.read(img.contents).then(cb)
  if (!(res instanceof jimp)) {
    throw new Error('Jimp instance must be returned from your callback.')
  }

  const ext = path.extname(img.path).slice(1)
  return res.getBufferAsync(MIME_TYPES[ext])
}

const gulpJimp = cb =>
  through.obj(async (img, _, callback) => {
    if (img.isNull()) {
      callback(null, img)
      return
    }

    if (img.isStream()) {
      callback(pluginError('Stream is not supported.'))
      return
    }

    if (typeof cb !== 'function') {
      callback(pluginError(`Argument '${cb}' is not a function.`))
      return
    }

    try {
      const data = await processImage(img, cb)
      img.contents = Buffer.from(data)
      callback(null, img)
    } catch (err) {
      callback(pluginError(err.message))
    }
  })

module.exports = gulpJimp
