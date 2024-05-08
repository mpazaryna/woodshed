
// In Math.pow (x, y) x is the base number and y is the exponent (the power to which the 
// base number is raised). 
// For example, Math.pow(3, 2) raises 3 to the power of 2, which gives 9.
function calculator(principal, interest, term) {
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

function calc(p, r, t) {
  var principal = p;
  var interest = monthlyRate(r);
  var term = termFromYears(t);
  var loan_type = "conventional"
  var x  = calculator(principal,interest, term);
  return parseFloat(x.toFixed(2));
}

function updatePageWithPayment(payment) {
  var htmlEl = document.getElementById("payment");
  htmlEl.innerText = "$" + payment;
}

// get a reference to the button object
var btn = document.getElementById("btn");

// get the inputs 
btn.onclick = function() {
  var p = document.getElementById("principal").value;
  var r = document.getElementById("rate").value;
  var t = document.getElementById("term").value;
  
  // static testing vals
  var p = 205000;
  var r = 6;
  var t = 30;
  
  // dump inputs to the console
  console.log(p,r,t);
  
  // principal must be greater than 0
  if (p < 0) {
    alert("Amount borrowed must be greater than zero.");
    return false;
  }
  
  // principal cannot be blank
  if (p == "") {
    alert("Principal is a required.");
    return false;
  }
  
  var payment = calc(p,r,t);
  updatePageWithPayment(payment);
};

