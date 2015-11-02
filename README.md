# Bitmap-transformer

Simple javascript object for doing color inversion and grayscale transformations on bitmaps

## Installation

`npm install git://github.com/monkeyFeathers/Bitmap-transformer`

## Usage

Import like normal

`var Bitmap = require('bitmap-transformer')`

### load

performs an async file read.

`var bitmap;
Bitmap.load('bitmap_file_path', function(error, data){
    if (error) throw error;
    bitmap = data;
})
console.log(bitmap)
// Bitmap {}
`

### grayScaleTransform

changes color to grayscale. **WARNING** this operation is irreversible, so if you want the original you will need to reload it.

`bitmap.grayScaleTransform()`


### invertColorTransform

inverts the colors (call twice to go back to original).

`bitmap.invertColorTransform()`

### save

save the bit map to a file. If no destination path is specified the function will return the bitmap buffer.

`bitmap.save('dest-file.bmp', function(error, data){
    console.log('saved!')
})
// saved!`

## Tests

`gulp tests`

## License

MIT

## Release History

* 0.1.0 Initial release
