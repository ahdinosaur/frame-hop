frame-hop
=========
Cuts a stream of floating point frames into a stream of partially overlapping frames.

## Example

```javascript
// Create frame slicer
var frameHop = require('frame-hop')
var stdout = require('stdout')

var slicer = frameHop({
  frameSize: 256,
  hopSize: 64,
}.pipe(stdout())

// Add frames to slices by calling .write:
slicer.write(data)

// Or pipe another stream into slicer...
```

## Install

    npm install frame-hop

#### `require('frame-hop')(opts)`
Creates a windowed frame slicer

* `opts.frameSize` is the size of an output frame
* `opts.hopSize` is the amount of hopping between frames
* `opts.maxDataSize` is the maximum amount of data per input frame (default `opts.frameSize`)

**Returns** A `Transform` stream which if written to adds data to the rolling frame buffer to be read.

## Credits
(c) 2013 Mikola Lysenko. MIT License
