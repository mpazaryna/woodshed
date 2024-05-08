// holds all functions for scripts
module.exports = {
  // must keave one blank line before naming first function

  pi_cal: pi_cal,
  round_num: round_num,
};

function round_num(numxx) {
  numxx = numxx * 100;
  numxx = Math.floor(numxx);
  numxx = numxx / 100;
  return numxx;
}

// To calculate monthly pi payment variables - int_rate, term
function pi_cal(int_rate, term, principal) {
  var x = Math.pow(1 + int_rate, term);
  var pi = (principal * x * int_rate) / (x - 1);
  return pi;
}
