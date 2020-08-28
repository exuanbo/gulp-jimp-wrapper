'use strict'

const fs = require('fs')
const path = require('path')
const should = require('chai').should()
const Vinyl = require('vinyl')
const jimp = require('..')

const getFile = file => {
  const filePath = path.join(__dirname, 'img', file)
  return new Vinyl({
    base: path.dirname(filePath),
    path: filePath,
    contents: fs.readFileSync(filePath)
  })
}

const compare = (stream, fixtureName, expectedName, done, expectedErr) => {
  stream.on('error', err => {
    if (expectedErr) should.equal(err.message, expectedErr)
    done()
  })

  stream.on('data', file => {
    should.equal(
      file.contents.toString('base64'),
      getFile(expectedName).contents.toString('base64')
    )
    done()
  })

  stream.write(getFile(fixtureName))
  stream.end()
}

describe('gulp-jimp-wrapper', () => {
  it('works for me', done => {
    compare(
      jimp(img => img.invert()),
      'original.jpg',
      'invert.jpg',
      done
    )
  })

  it('throws an error', done => {
    compare(
      jimp('img => img.invert()'),
      'original.jpg',
      'invert.jpg',
      done,
      'Argument img => img.invert() is not a function'
    )
  })
})
