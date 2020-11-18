'use strict'

const fs = require('fs')
const path = require('path')
const expect = require('chai').expect
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

const toBase64 = contents => contents.toString('base64')

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
    expect(toBase64(file.contents)).to.equal(
      toBase64(getFile(expectedName).contents)
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
      `Argument \`img => img.invert()\` is not a function`
    )
  })
})