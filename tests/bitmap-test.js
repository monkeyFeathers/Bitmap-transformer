'use strict';

var chai = require('chai');
var expect = chai.expect;
var should = chai.should;
var Bitmap = require('../bitmap');
var fs = require('fs');
var bitmapPath = './bitmaps/pikachu.bmp';


describe('Bitmap', function(){

  describe("#load", function(){

    it('should throw an error if no path specified', function(done){
      Bitmap.load('',function(err, data) {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should return the bitmap object if it works', function(done){
      Bitmap.load(bitmapPath, function(err, data){
        expect(data).to.be.ok.and.to.be.a('Object');
        done()
      });
    });

  });

  describe('#grayScaleTransform', function(){
    var  bitmap;
    var refBitmap;

    before(function(done){
      Bitmap.load(bitmapPath, function(err, data){
        if (err) throw err;
        bitmap = data;
        Bitmap.load(bitmapPath, function(err, data){
          if (err) throw err;
          refBitmap = data;
          done();
        })
      })
    })

    it('should change the bitmap pixels', function(done){
      bitmap.grayScaleTransform();
      expect(bitmap.getPixels()[0]).to.not.deep.eql(refBitmap.getPixels()[0]);
      done();
    });
    it('should be grayscale', function(done){
      var firstPixel = refBitmap.getPixels()[0];
      var tPix = (bitmap.getPixels()[0] + bitmap.getPixels()[0] + bitmap.getPixels()[0])/3
      expect(bitmap.getPixels()[0]).to.eql(tPix)
      done()
    });
    it('should have changed the buffer', function(done){
      expect(bitmap.getBuffer()[54]).to.not.eql(refBitmap.getBuffer()[54]);
      done()
    });


  });
  //
  describe('#invertColorTransform', function(){
    var  bitmap;
    var refBitmap;

    before(function(done){
      Bitmap.load(bitmapPath, function(err, data){
        if (err) throw err;
        bitmap = data;
        Bitmap.load(bitmapPath, function(err, data){
          if (err) throw err;
          refBitmap = data;
          done();
        })
      })
    })

    it('should change the bitmap pixels', function(done){
      bitmap.invertColorTransform();
      expect(bitmap.getPixels()[0]).to.not.deep.eql(refBitmap.getPixels()[0]);
      done();
    });
    it('should be color inverted', function(done){
      var firstPixel = refBitmap.getPixels()[0];
      var tPix = 255 - firstPixel;
      expect(bitmap.getPixels()[0]).to.eql(tPix)
      done()
    });

    it('should have changed the buffer', function(done){
      expect(bitmap.getBuffer()[54]).to.not.eql(refBitmap.getBuffer()[54]);
      done()
    });
  });

  describe('#Save', function(){
    var  bitmap;

    before(function(done){
      Bitmap.load(bitmapPath, function(err, data){
        if (err) throw err;
        bitmap = data;
        done();
      })
    })

    it('should save without errors',function(done){
      bitmap.save('./bitmaps/pikachu-save.bmp', function(error, data) {
        expect(error, 'error' + error).to.not.be.ok;
        expect(data, 'data ' + data).to.be.ok;
        done();
      });
    });

    it('should actually write a new file', function(done){
      fs.exists('./bitmaps/pikachu-save.bmp', function(exists){
        expect(exists).to.be.ok;
        done();
      })

    });

    after(function(done){
      fs.exists('./bitmaps/pikachu-save.bmp', function(exists){
        if (exists) {
          fs.unlink('./bitmaps/pikachu-save.bmp', function(err){
            if (err) throw err;
            done();
          })
        }

      })
    })

  });

});
