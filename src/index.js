'use strict'

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

const getMIMEType = img => MIME_TYPES[img.extname.slice(1).toLowerCase()]

const processImage = async (img, cb, MIMEType) => {
  const res = await jimp.read(img.contents).then(cb)
  if (!(res instanceof jimp)) {
    throw new Error('Jimp instance must be returned from your callback.')
  }
  return res.getBufferAsync(MIMEType)
}

const gulpJimp = (cb, { basename, extname } = {}) =>
  through.obj(async (img, _, callback) => {
    if (img.isNull()) {
      callback(null, img)
      return
    }

    try {
      if (img.isStream()) {
        throw new Error('Stream is not supported.')
      }

      if (typeof cb !== 'function') {
        throw new Error(`Argument '${cb}' is not a function.`)
      }

      if (basename) {
        img.stem = basename
      }
      if (extname) {
        extname = extname.startsWith('.') ? extname : `.${extname}`
        img.extname = extname
      }

      const MIMEType = getMIMEType(img)
      if (!MIMEType) {
        throw new Error(`MIME type '${extname.slice(1)}' is not supported.`)
      }

      const data = await processImage(img, cb, MIMEType)
      img.contents = Buffer.from(data)
      callback(null, img)
    } catch (err) {
      callback(pluginError(err.message))
    }
  })

module.exports = gulpJimp
