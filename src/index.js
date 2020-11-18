'use strict'

const path = require('path')
const through = require('through2')
const PluginError = require('plugin-error')
const jimp = require('jimp')

const PLUGIN_NAME = 'gulp-jimp-wrapper'
const SUPPORTED_MIME_TYPES = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  gif: 'image/gif'
}

const pluginError = msg => new PluginError(PLUGIN_NAME, msg)

const processImage = async (img, cb) => {
  const res = await jimp.read(img.contents).then(cb)
  if (!(res instanceof jimp)) {
    throw pluginError('Jimp instance must be returned from your callback.')
  }

  const ext = path.extname(img.path).slice(1)
  return res.getBufferAsync(SUPPORTED_MIME_TYPES[ext])
}

const gulpJimp = cb =>
  through.obj(async function (img, _, callback) {
    if (img.isNull()) {
      callback(null, img)
      return
    }

    if (img.isStream()) {
      callback(pluginError('Streaming not supported.'))
      return
    }

    if (typeof cb !== 'function') {
      callback(pluginError(`Argument '${cb}' is not a function.`))
      return
    }

    try {
      const data = await processImage(img, cb)
      img.contents = Buffer.from(data)
      this.push(img)
    } catch (err) {
      this.emit('error', pluginError(err.message))
    }

    callback()
  })

module.exports = gulpJimp
