var expect = require('chai').expect;
var calculator = require('./index');

describe('Calculator', function() {
    
  it('should return a value of added numbers', function() {
    var z = calculator.adder(1,3);
    expect(4).to.equal(z);
  });
    
  it('should return a value of the sum of 2 numbers multiplied by a 3rd', function() {
    var e = calculator.calcEquity(4,2,2);
    expect(12).to.equal(e);
  });
  
  it('should calcutate term, years * 12', function() {
    var e = calculator.termFromYears(30);
    expect(360).to.equal(e);
  });
    
  it('should calcutate the monthlyRate', function() {
    var e = calculator.monthlyRate(6);
    expect(0.005).to.equal(e);
  });  
    
});
