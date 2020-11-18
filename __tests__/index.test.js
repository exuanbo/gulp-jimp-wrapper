'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
const Vinyl = require('vinyl')
const jimp = require('..')

const toBase64 = contents => contents.toString('base64')

const getFile = file => {
  if (typeof file !== 'string') {
    return new Vinyl({ contents: file })
  }

  const filePath = path.join(__dirname, 'img', file)
  return new Vinyl({
    base: path.dirname(filePath),
    path: filePath,
    contents: fs.readFileSync(filePath)
  })
}

const compare = (stream, fixtureName, expectedName, done, expectedErr) => {
  stream.on('error', err => {
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
  })

  stream.on('data', file => {
    const { contents } = file
    const expectedContents = getFile(expectedName).contents

    if (expectedContents === null) {
      expect(contents).to.equal(expectedContents)
      done()
      return
    }

    expect(toBase64(contents)).to.equal(toBase64(expectedContents))
    done()
  })

  stream.write(getFile(fixtureName))
  stream.end()
}

describe('gulp-jimp-wrapper', () => {
  it('should callback in advance if file is null', done => {
    compare(
      jimp(img => img.invert()),
      null,
      null,
      done
    )
  })

  it('should throw an error if file is stream', done => {
    compare(
      jimp(img => img.invert()),
      fs.createReadStream(path.join(__dirname, 'img', 'original.jpg')),
      null,
      done,
      'Streaming not supported.'
    )
  })

  it('should throw an error if argument is illegal', done => {
    compare(
      jimp('img => img.invert()'),
      'original.jpg',
      null,
      done,
      "Argument 'img => img.invert()' is not a function."
    )
  })

  it('should just work', done => {
    compare(
      jimp(img => img.invert()),
      'original.jpg',
      'invert.jpg',
      done
    )
  })

  it('throws an error if callback does not return a Jimp instance', done => {
    compare(
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
    compare(
      jimp(img => img.no_such_method()),
      'original.jpg',
      'invert.jpg',
      done,
      'img.no_such_method is not a function'
    )
  })
})
