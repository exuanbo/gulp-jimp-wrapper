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
      expect(err.message).to.equal(expectedErr)
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
  it('should callback in advance if img is null', done => {
    compare(
      jimp(img => img.invert()),
      null,
      null,
      done
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

  it('should throw an error if argument is illegal', done => {
    compare(
      jimp('img => img.invert()'),
      'original.jpg',
      'invert.jpg',
      done,
      "Argument 'img => img.invert()' is not a function."
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
})
