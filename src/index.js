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

const jimpWrapper = cb =>
  through.obj(async function (img, _, callback) {
    if (img.isNull()) {
      callback(null, img)
      return
    }

    if (img.isStream()) {
      callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      return
    }

    if (typeof cb !== 'function') {
      callback(
        new PluginError(PLUGIN_NAME, `Argument \`${cb}\` is not a function`)
      )
      return
    }

    try {
      const data = await processImg(img, cb)
      img.contents = Buffer.from(data)
      this.push(img)
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err))
    }

    callback()
  })

module.exports = jimpWrapper
