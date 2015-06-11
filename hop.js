"use strict"

var through = require('through2')

// Slices a stream of frames into a stream of overlapping windows
// The size of each frame is the same as the size o
function createHopStream(opts) {
  if (opts.frameSize == null) {
    throw new Error("Frame size not given")
  }
  var frameSize = opts.frameSize

  if (opts.hopSize == null) {
    throw new Error("Hop size not given")
  }
  var hopSize = opts.hopSize

  if(hopSize > frameSize) {
    throw new Error("Hop size must be smaller than frame size")
  }
  var maxDataSize = maxDataSize || frameSize

  var TypedArray = opts.TypedArray || Float32Array

  var buffer = new TypedArray(2 * frameSize + maxDataSize)
  var ptr = 0
  var frameSlices = []

  for (var h = 0; h + frameSize <= buffer.length; h += hopSize) {
    frameSlices.push(buffer.subarray(h, h + frameSize))
  }

  return through.obj(processHopData)

  function processHopData(data, enc, cb) {
    var i, j, k

    buffer.set(data, ptr)
    ptr += data.length
    
    for (i = 0, j = 0; j + frameSize <= ptr; ++i, j += hopSize) {
      this.push(new TypedArray(frameSlices[i]))
    }

    for (k = 0; j < ptr; ) {
      buffer.set(frameSlices[i], k)

      var nhops = Math.ceil((k + frameSize) / hopSize) | 0
      var nptr  = nhops * hopSize

      if(nptr !== k + frameSize) {
        nhops -= 1
        nptr -= hopSize
      }

      i += nhops
      j += (nptr - k)
      k = nptr
    }
    ptr += k - j

    cb()
  }
}

module.exports = createHopStream
