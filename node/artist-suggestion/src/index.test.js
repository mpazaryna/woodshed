var expect = require('chai').expect;
var artistNames = require('./index');

describe('artist-names', function() {
  describe('all', function() {
    it('should be an array of strings', function() {
      expect(artistNames.all).to.satisfy(isArrayOfStrings);

      function isArrayOfStrings(array) {
        return array.every(function(item) {
          return typeof item === 'string';
        });
      }
    });

    it('should contain `Beatles`', function() {
      expect(artistNames.all).to.include('Beatles');
    });
  });

  describe('random', function() {
    it('should return a random item from the artistNames.all', function() {
      var randomItem = artistNames.random();
      expect(artistNames.all).to.include(randomItem);
    });
  });
  
  describe('calc', function() {
    
    it('should return a value of added numbers', function() {
      var z = artistNames.adder(1,3);
      expect(4).to.equal(z);
    });
    
    it('should return a value of the sum of 2 numbers multiplied by a 3rd', function() {
      var e = artistNames.calcEquity(4,2,2);
      expect(12).to.equal(e);
    });
    
  });
});