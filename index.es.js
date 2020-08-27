import path from 'path';
import through from 'through2';
import PluginError from 'plugin-error';
import jimp from 'jimp';

const PLUGIN_NAME = 'gulp-jimp-wrapper';
const supportedMimetypes = {
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  gif: 'image/gif'
};

const processImg = (img, cb) => new Promise((resolve, reject) => {
  const extension = path.extname(img.path).split('.').pop();

  jimp
    .read(img.contents)
    .then(cb)
    .then(img => img.getBufferAsync(supportedMimetypes[extension]))
    .then(newImgContents => resolve(newImgContents))
    .catch(err => reject(err));
});

const jimpWrapper = cb => {
  return through.obj(async (img, _, callback) => {
    try {
      if (img.isNull()) {
        return callback(null, img)
      }

      if (img.isStream()) {
        return callback(new PluginError(PLUGIN_NAME, 'Streaming not supported'))
      }

      if (typeof(cb) !== 'function') {
        return callback(new PluginError(PLUGIN_NAME, `Argument ${cb} is not a function`))
      }

      const newImgContents = await processImg(img, cb);
      img.contents = Buffer.from(newImgContents);
      callback(null, img);
    } catch (err) {
      callback(new PluginError(PLUGIN_NAME, err));
    }
  })
};

var gulpJimpWrapper = jimpWrapper;

export default gulpJimpWrapper;
