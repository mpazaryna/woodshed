// Utils holds all functions for scripts
module.exports = {
  check_inputs: check_inputs,
  constants_check: constants_check,
};

function constants_check(int_rate, term) {
  var temp_rate = int_rate;
  var i_rate = int_rate / 100; // 2nd variable for computing tax deduction
  var int_rate = int_rate / 100 / 12; // convert interest to monthly decimal rate
  var principal = 1000; // intial setting for principal to cal factor for inputted interest rate
  var term = term * 12; // Number of months in term. for code
  var spcounter = 1.0; // used in other programs
  var codes = [];
  codes.push(temp_rate);
  codes.push(i_rate);
  codes.push(principal);
  codes.push(term);
  codes.push(spcounter);
  codes.push(int_rate);
  return codes;
}

function check_inputs(
  int_rate,
  s_cred,
  lim_piti,
  input_ltv,
  term,
  input_ma,
  org_fee,
  lend_cred
) {
  var input_ma_yes = 'No'; // default setting for no ma entered by user
  var lim_piti_input = 'No';
  var input_ltv_yes = 'No';
  if (int_rate < 1) {
    int_rate = int_rate * 100;
  }
  if (s_cred > 0 && s_cred < 1) {
    s_cred = s_cred / 100;
  } //entered as decimal or dol_cred entered
  if (s_cred != 0 && s_cred >= 1) {
    s_cred = s_cred / 100;
  }
  if (lend_cred != 0 && lend_cred > 0) {
    lend_cred = lend_cred / 100;
  }
  if (lend_cred > 0.04) {
    lend_cred = 0.04;
  }
  if (lim_piti != 0) {
    lim_piti_input = 'Yes';
  }
  if (input_ltv != 0 && input_ltv > 1) {
    input_ltv = input_ltv / 100;
  }
  if (input_ltv != 0) {
    input_ltv_yes = 'Yes';
  }
  if (input_ma != 0) {
    input_ma_yes = 'Yes';
  }
  if (term > 30) {
    term = 30;
  }
  if (org_fee != 0) {
    org_fee = org_fee / 100;
  }
  //if(org_fee>.01){org_fee=.01}; Limit org fee to 1%. Removed for seller net module
  var codes = [];
  codes.push(int_rate);
  codes.push(s_cred);
  codes.push(lim_piti);
  codes.push(lim_piti_input);
  codes.push(input_ltv);
  codes.push(input_ltv_yes);
  codes.push(term);
  codes.push(input_ma_yes);
  codes.push(org_fee);
  codes.push(lend_cred);
  return codes;
}
