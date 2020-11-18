'use strict'

const fs = require('fs')
const path = require('path')
const { expect } = require('chai')
const Vinyl = require('vinyl')
const jimp = require('..')

const handleError = (err, done, expectedErr) => {
  if (expectedErr) {
    try {
      expect(err.message).to.equal(expectedErr)
    } catch (assertionError) {
      done(assertionError)
      return
    }
    done()
    return
  }
  done(err)
}

const handleData = (file, done, cb) => {
  try {
    cb(file)
  } catch (assertionError) {
    done(assertionError)
    return
  }
  done()
}

const getFile = filename => {
  if (typeof filename !== 'string') {
    return new Vinyl({ contents: filename })
  }

  const filePath = path.join(__dirname, 'img', filename)
  return new Vinyl({
    base: path.dirname(filePath),
    path: filePath,
    contents: fs.readFileSync(filePath)
  })
}

const toBase64 = contents => contents.toString('base64')

const compareContent = (
  stream,
  fixtureName,
  expectedName,
  done,
  expectedErr
) => {
  stream.on('error', err => handleError(err, done, expectedErr))

  stream.on('data', file =>
    handleData(file, done, file => {
      const { contents } = file
      const expectedContents = getFile(expectedName).contents
      if (!expectedContents) {
        expect(contents).to.equal(expectedContents)
        return
      }
      expect(toBase64(contents)).to.equal(toBase64(expectedContents))
    })
  )

  stream.write(getFile(fixtureName))
  stream.end()
}

const compareFilename = (stream, expectedName, done, expectedErr) => {
  stream.on('error', err => handleError(err, done, expectedErr))

  stream.on('data', file =>
    handleData(file, done, file => {
      const [stem, extname] = expectedName.split('.')
      expect(file.stem).to.equal(stem)
    })
  )

  stream.write(getFile('original.jpg'))
  stream.end()
}

describe('gulp-jimp-wrapper', () => {
  it('should callback in advance if file is null', done => {
    compareContent(
      jimp(img => img.invert()),
      null,
      null,
      done
    )
  })

  it('should just work', done => {
    compareContent(
      jimp(img => img.invert()),
      'original.jpg',
      'invert.jpg',
      done
    )
  })

  it('should rename with basename', done => {
    compareFilename(
      jimp(img => img.invert(), { basename: 'invert' }),
      'invert.jpg',
      done
    )
  })

  it('should rename with extname', done => {
    compareFilename(
      jimp(img => img.invert(), { extname: '.png' }),
      'original.png',
      done
    )
  })

  it('should rename with both basename and extname', done => {
    compareFilename(
      jimp(img => img.invert(), { basename: 'invert', extname: '.png' }),
      'invert.png',
      done
    )
  })
})

describe('handle error', () => {
  it('should throw an error if file is stream', done => {
    compareContent(
      jimp(img => img.invert()),
      fs.createReadStream(path.join(__dirname, 'img', 'original.jpg')),
      null,
      done,
      'Stream is not supported.'
    )
  })

  it('should throw an error if argument is illegal', done => {
    compareContent(
      jimp('img => img.invert()'),
      'original.jpg',
      null,
      done,
      "Argument 'img => img.invert()' is not a function."
    )
  })

  it('throws an error if callback does not return a Jimp instance', done => {
    compareContent(
      jimp(img => {
        img.invert()
      }),
      'original.jpg',
      'invert.jpg',
      done,
      'Jimp instance must be returned from your callback.'
    )
  })

  it('should throw an meaningful error if Jimp fails', done => {
    compareContent(
      jimp(img => img.no_such_method()),
      'original.jpg',
      'invert.jpg',
      done,
      'img.no_such_method is not a function'
    )
  })
})
