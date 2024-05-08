var programNames = require('./programs.json');

module.exports = {
  adder: adder,
  calcEquity: calcEquity,
  calcNew: calcNew,
  termFromYears: termFromYears,
  monthlyRate: monthlyRate
};

function adder(x,y) {
  return x + y;
}

function calcEquity(x,y,z) {
  return ((x + y) * z);
}

// In Math.pow (x, y) x is the base number and y is the exponent (the power to which the 
// base number is raised). 
// For example, Math.pow(3, 2) raises 3 to the power of 2, which gives 9.
function calcNew(principal, interest, term) {
  var x  = (principal * interest) / (1 - Math.pow(1 + interest, -term));
  return x;
}
 
// The calculator will have to divide the interest rate (IN) by 12 
// (converting the annual mortgage interest rate into a monthly 
// mortgage interest rate)
function monthlyRate(percent) {
  var x = (percent/12)/100;
  return x;
}

// The mortgage calculator will also have to convert the number of periods (PE) into monthly 
// mortgage loan payment periods by multiplying it by 12.
function termFromYears(years) {
  var x = years * 12;
  return x;
}
