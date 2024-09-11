// Program to analyze renting compared to buying
function doIt(params) {
  function amort(bal, p, i_rate, t_pi, ex_prin) {
    // Buy or rent program
    total_int = 0;
    for (i = 1; i < p; i++) {
      year = i / 12;
      yy = Math.floor(year);
      t_int = (i_rate * bal) / 12; // monthly interest
      total_int = total_int + t_int;
      p_recd = t_pi - t_int; // normal P&I
      p_recd = p_recd + ex_prin; // extra principal payment
      var bal = bal - p_recd; // principal balance after posting payment
      // total_months=i;
      if (ex_prin > 0 && bal <= t_pi) {
        ex_bal = bal;
        break;
      } else {
        ex_bal = 0;
      }
    }
    if (ex_prin == 0) {
      total_months = i - 1;
    } else {
      total_months = i;
    }
    // console.log(" ")
    //console.log("loops "+i+" Months "+total_months+" Remaning Bal "+ex_bal)
    var codes = [];
    codes.push(total_months);
    codes.push(bal);
    codes.push(total_int);
    codes.push(ex_bal);
    return codes;
  }
  var lib = require('./lib'); // common file for functions
  var setup = require('./setup');
  var int_rate = params.int_rate; // should be input interest Rate
  var ex_prin = params.ex_prin; // Extra principal to be applies to amortization
  var input_ma = params.input_ma; // For amortization need loan amount
  var term = params.term; // Should be input of mortgage Term
  var input_term = params.input_term; // if shorter term is enter by user
  con_results = 'y'; // if con_results=="n" results will display in a table array format
  var today = new Date();
  var current_date =
    today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear();
  if (int_rate < 1) {
    display_rate = int_rate * 100;
    display_rate = display_rate.toFixed(3);
  } else {
    display_rate = int_rate;
  }
  var fumess =
    'Christee Amortization of $' +
    input_ma +
    ' Loan at ' +
    display_rate +
    '% ' +
    current_date;

  // ** START **
  var zInputs = {
    int_rate: params.int_rate,
    ex_prin: params.ex_prin,
    input_ma: params.input_ma,
    input_term: params.input_term,
  };
  // ** END ***

  var codes = setup.check_inputs(int_rate, s_cred, lim_piti, input_ltv, term);
  var int_rate = codes[0];
  var s_cred = codes[1];
  var input_scred = s_cred;
  var lim_piti = codes[2];
  var lim_piti_input = codes[3];
  var input_ltv = codes[4];
  var input_ltv_yes = codes[5];
  var term = codes[6];
  var input_ltv_yes = input_ltv;
  var codes = setup.constants_check(int_rate, term);
  var temp_rate = codes[0];
  var i_rate = codes[1];
  var principal = codes[2];
  var term = codes[3];
  var spcounter = codes[4];
  var int_rate = codes[5];
  //************************* Start Amort.js
  finish = 'f';
  save_months = 0;
  if (input_term != 0) {
    input_term = input_term * 12;
  } // input term is ignored
  var ma = input_ma;
  var pi_fac = lib.pi_cal(int_rate, term, principal); // first pi factor for normal term
  var t_pi = pi_fac * (ma / 1000); // pi for original term
  if (input_term != 0 && input_term < term) {
    // get different pi_fac for shorter term
    temp_term = term; // original term for loan
    orig_pi_fac = pi_fac; // pi factor for original term
    orig_pi = t_pi;
    term = input_term; // set term to shorter period of time for cal of pi_fac
    var pi_fac = lib.pi_cal(int_rate, term, principal); // first pi factor for normal term
    var new_pi = pi_fac * (ma / 1000); // pi for new term
    var ex_prin = new_pi - orig_pi; // extra principal required to payoff in shorter term
    var term = temp_term; // reset term to original term
    pi_fac = orig_pi_fac;
    t_pi = orig_pi; // using payment for new term
  }
  if (ex_prin > t_pi) {
    ex_prin = t_pi;
  } //maximum extra payment is equal to mortgage payment
  p_recd = 0;
  p = term + 1;
  year_pi = t_pi * 12 + ex_prin * 12;
  year_pi = year_pi * 100;
  year_pi = Math.floor(year_pi);
  year_pi = year_pi / 100;
  beg_bal = ma;
  ma_bal = ma;
  bal = ma;
  codes = amort(bal, p, i_rate, t_pi, ex_prin);
  total_months = codes[0];
  bal = codes[1];
  total_int = codes[2];
  ex_bal = codes[3];
  //p=total_months
  monthly_pi = t_pi * 100;
  monthly_pi = Math.floor(monthly_pi);
  monthly_pi = monthly_pi / 100;
  total_int = Math.floor(total_int * 100);
  total_int = total_int / 100;
  extra_p = Math.floor(ex_prin * 100);
  extra_p = extra_p / 100;
  if (total_months < term) {
    save_months = term - total_months;
  }
  header = [
    [
      'Monthly PI',
      'Original',
      'Extra Principal',
      'Payoff',
      'Months',
      'Total Interest',
    ],
    ['Payment', 'Term', 'Payment', 'Months', 'Reduced', 'Paid'],
    [monthly_pi, term, extra_p, total_months, save_months, total_int],
  ];

  var results_display = new Array();
  results_display = [
    [
      'Month',
      'Year',
      'Year',
      'Year',
      'Interest',
      'Year',
      'Principal',
      'Mortgage',
    ],
    [
      'Number',
      'Number',
      'Payment',
      'Interest',
      'Percent',
      'Principal',
      'Percent',
      'Balance',
    ],
  ];
  for (i = 1; i < p; i++) {
    year = i / 12;
    yy = Math.floor(year);
    if (i <= total_months) {
      t_int = (i_rate * ma_bal) / 12; // monthly interest
      p_recd = t_pi - t_int; // normal P&I
      p_recd = p_recd + ex_prin; // extra principal payment
      var ma_bal = ma_bal - p_recd; // principal balance after posting payment
    }

    if (ex_prin != 0 && i == total_months) {
      // less than 1 year left on schedule
      year = last_year + 1;
      r_months = i - last_month; // months left to pay
      year_pi = t_pi * r_months + ex_prin * r_months + ex_bal; // amount of payment during partial last year
      numxx = year_pi;
      numxx = lib.round_num(numxx);
      year_pi = numxx;
      year_prin = beg_bal - ma_bal + ex_bal; // principal reduction one year
      year_inter = year_pi - year_prin; // interest for one year
      numxx = year_inter;
      numxx = lib.round_num(numxx);
      year_inter = numxx;
      numxx = year_prin;
      numxx = lib.round_num(numxx);
      year_prin = numxx;
      per_prin = year_prin / year_pi;
      per_prin = per_prin * 100;
      numxx = per_prin;
      numxx = lib.round_num(numxx);
      per_prin = numxx;
      per_inter = year_inter / year_pi;
      per_inter = per_inter * 100;
      numxx = per_inter;
      numxx = lib.round_num(numxx);
      per_inter = numxx;
      year_bal = ma_bal - ex_bal;
      numxx = year_bal;
      numxx = lib.round_num(numxx);
      year_bal = numxx;
      if (year_bal <= 10) {
        ma_bal = 0;
        year_bal = 0;
      }
      results_display.push([
        i,
        year,
        year_pi,
        year_inter,
        per_inter,
        year_prin,
        per_prin,
        year_bal,
      ]),
        (finish = 't');
    } // if ex_prin!=0

    if (year == yy && finish != 't') {
      year_prin = beg_bal - ma_bal; // principal reduction one year
      year_inter = year_pi - year_prin; // interest for one year
      numxx = year_inter;
      numxx = lib.round_num(numxx);
      year_inter = numxx;
      numxx = year_prin;
      numxx = lib.round_num(numxx);
      year_prin = numxx;
      per_prin = year_prin / year_pi;
      per_prin = per_prin * 100;
      numxx = per_prin;
      numxx = lib.round_num(numxx);
      per_prin = numxx;
      per_inter = year_inter / year_pi;
      per_inter = per_inter * 100;
      numxx = per_inter;
      numxx = lib.round_num(numxx);
      per_inter = numxx;
      year_bal = ma_bal;
      numxx = year_bal;
      numxx = lib.round_num(numxx);
      year_bal = numxx;
      if (year_bal <= 10) {
        year_bal = 0;
        ma_bal = 0;
      }
      var xx = year;
      results_display.push([
        i,
        year,
        year_pi,
        year_inter,
        per_inter,
        year_prin,
        per_prin,
        year_bal,
      ]),
        (beg_bal = ma_bal); // reset beginning balance
      last_year = year;
      last_month = i;
    } // end of year=yy

    if (ma_bal <= 0 || i > p) {
      break;
    }
  } // end of amortization loop

  var ma_bal = Math.floor(ma_bal);
  if (con_results == 'y') {
    //console.log('Christee Amortization Summary'+' '+current_date)
    console.log(fumess);
    console.log(' ');
    console.log(
      'Monthly' +
        ':\t' +
        'Original' +
        ':\t' +
        'Extra ' +
        ':\t\t' +
        'Payoff' +
        ':\t\t' +
        ' Months' +
        ':\t' +
        'Interest'
    );
    console.log(
      'Payment' +
        ':\t' +
        ' Term' +
        ':\t\t' +
        'Payment' +
        ':\t' +
        'Months' +
        ':\t\t' +
        ' Reduced' +
        ':\t' +
        ' Paid'
    );
    monthly_pi = header[2][0];
    term = header[2][1];
    extra_p = header[2][2];
    extra_p = extra_p.toFixed(2);
    total_months = header[2][3];
    save_month = header[2][4];
    total_int = header[2][5];
    total_int = total_int.toFixed(2);
    console.log(
      '$' +
        monthly_pi +
        '\t' +
        term +
        '\t\t$' +
        extra_p +
        '\t\t' +
        total_months +
        '\t\t' +
        ' ' +
        save_months +
        '\t\t$' +
        total_int
    );
    console.log(' ');
    console.log('Amortization Details on A Year To Year Basis');
    console.log(' ');

    y = year + 2;
    console.log(
      'Month' +
        ':\t' +
        ' Year' +
        ':\t' +
        ' Yearly' +
        ':\t' +
        ' Yearly' +
        ':\t' +
        'Interest' +
        ':\t' +
        ' Yearly' +
        ':\t' +
        'Principal' +
        ':\t' +
        'Mortgage'
    );
    console.log(
      'Number' +
        ':\t' +
        'Number' +
        ':\t' +
        'Payment' +
        ':\t' +
        'Interest' +
        ':\t' +
        'Perecent' +
        ':\t' +
        'Principal' +
        ':\t' +
        ' Percent' +
        ':\t' +
        ' Balance'
    );
    for (m = 2; m < y; m++) {
      var i = results_display[m][0];
      var year = results_display[m][1];
      var year_pi = results_display[m][2];
      year_pi = year_pi.toFixed(2);
      var year_inter = results_display[m][3];
      year_inter = year_inter.toFixed(4);
      var per_inter = results_display[m][4];
      per_inter = per_inter.toFixed(3);
      var year_prin = results_display[m][5];
      year_prin = year_prin.toFixed(2);
      var per_prin = results_display[m][6];
      per_prin = per_prin.toFixed(2);
      var year_bal = results_display[m][7];
      year_bal = year_bal.toFixed(2);
      console.log(
        i +
          '\t' +
          year +
          '\t$' +
          year_pi +
          '\t$' +
          year_inter +
          '\t ' +
          per_inter +
          ' %' +
          '\t$' +
          year_prin +
          '\t ' +
          per_prin +
          ' %' +
          '\t' +
          year_bal
      );
    }
  } else {
    console.table(header);
    console.table(results_display);
  }

  // That's All Folks

  return {
    zInputs,
    header,
    fumess: fumess,
    results_display,
  };
}
module.exports = { doIt };
