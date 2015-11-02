'use strict';
var fs = require('fs');

function Bitmap(data) {
  this.buffer = null;
  this.header = {};
  if (data) {
    this.parse(data);

  }

}

Bitmap.load = function(fileName, cb) {
  fs.readFile(fileName, function(error, data) {
    if (error) {cb(error);}

    cb(null, new Bitmap(data));
  });

};

Bitmap.prototype.parse = function(data) {
  this.buffer = data;
  this.header = {

    // see https://en.wikipedia.org/wiki/BMP_file_format for more info
    //	the size of this header (40 bytes)
    headerSize: this.buffer.readUIntLE(14, 4),

    //	the bitmap width in pixels (signed integer)
    bitmapWidth: this.buffer.readUIntLE(18, 4),

    //	the bitmap height in pixels (signed integer)
    bitmapHeight: this.buffer.readUIntLE(22, 4),

    //	the number of color planes (must be 1)
    colorPanes: this.buffer.readUIntLE(26, 2),

    //	the number of bits per pixel, which is the color depth of the image.
    // Typical values are 1, 4, 8, 16, 24 and 32.
    bitsPerPixel: this.buffer.readUIntLE(28, 2),

    //	the compression method being used.
    // See the https://en.wikipedia.org/wiki/BMP_file_formattable
    // for a list of possible values
    compressionMethod: this.buffer.readUIntLE(30, 4),

    //	the image size. This is the size of the raw bitmap data;
    // a dummy 0 can be given for BI_RGB bitmaps.
    imageSize: this.buffer.readUIntLE(34, 4),

    //	the horizontal resolution of the image.
    // (pixel per meter, signed integer)
    hRez: this.buffer.readUIntLE(38, 4),

    //	the vertical resolution of the image.
    // (pixel per meter, signed integer)
    vRez: this.buffer.readUIntLE(42, 4),

    //	the number of colors in the color palette, or 0 to default to 2n
    numberOfColorsInColorPalette: this.buffer.readUIntLE(46, 4),

    //	the number of important colors used, or 0 when every color is important;
    // generally ignored
    numberOfImportantColorsUsed: this.buffer.readUIntLE(50, 4),
  };

  this.pixelBuffer = this.buffer.slice(54, this.buffer.length);
};

Bitmap.prototype.getPixels = function() {
  return this.pixelBuffer;
};

Bitmap.prototype.getHeader = function() {
  return this.header;
};

Bitmap.prototype.getBuffer = function() {
  return this.buffer;
};

Bitmap.prototype.grayScaleTransform = function() {
  for (var i = 0; i < this.pixelBuffer.length; i += 3) {
    var  pixBuffer = this.pixelBuffer;
    var grayPix = (pixBuffer[i] + pixBuffer[i + 1] + pixBuffer[i + 2]) / 3;
    pixBuffer[i] = pixBuffer[i + 1] = pixBuffer[i + 2] = grayPix;
  }

  return this;
};

Bitmap.prototype.invertColorTransform = function() {
  for (var i = 0; i < this.pixelBuffer.length; i++) {
    var origByte = this.pixelBuffer[i];
    var invertedByte = 255 - origByte;
    this.pixelBuffer[i] = invertedByte;
  }

  return this;
};

Bitmap.prototype.save = function(filename, cb) {
  var buffer = this.buffer;
  if (!filename) {return buffer;}

  fs.writeFile(filename, buffer, function(error) {
    if (error) {cb(error);}

    cb(null, buffer);
  });

};

module.exports = Bitmap;
