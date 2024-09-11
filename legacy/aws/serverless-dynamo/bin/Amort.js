var lib = require("../src/3.0.1/Amort");

var paramsForm = {
  int_rate: 0.03625,
  ex_prin: 0,
  input_ma: 100000,
  term: 15,
  input_term: 25,
};

let results = lib.doIt(paramsForm);

//console.log(results.header);
//console.log(results.results_display);
//console.log(results.fumess);
