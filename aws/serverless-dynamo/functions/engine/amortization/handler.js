'use strict';

var calc = require('../../../src/Amort');
const Dynamo = require('../../common/Dynamo');
const Responses = require('../../common/API_Responses');
var lib = require('../../common/lib');
var api_version = '3.2.0';
var engine = 'amortization';
var run_date = new Date().toISOString();

module.exports.resolve = async (event, context) => {
  let company_name = 'ask';
  let cust_email = '';
  let cust_name = '';
  let cust_phone = '';
  let ex_prin = 0;
  let input_ma = 0;
  let input_term = 0;
  let int_rate = 0;
  let save_to_db = 'y';
  let term = 0;
  let doc_id = lib.docId();

  if (event.body) {
    event = JSON.parse(event.body);
  }

  if (event.int_rate) {
    int_rate = parseFloat(event.int_rate);
  }

  if (event.ex_prin) {
    ex_prin = lib.formInputDollar(event.ex_prin);
  }

  if (event.input_ma) {
    input_ma = lib.formInputDollar(event.input_ma);
  }

  if (event.term) {
    term = parseFloat(event.term);
  }

  if (event.input_term) {
    input_term = parseFloat(event.input_term);
  }

  if (event.cust_name) {
    cust_name = event.cust_name;
  } else {
    cust_name = 'nil';
  }

  if (event.cust_phone) {
    cust_phone = event.cust_phone;
  } else {
    cust_phone = 'nil';
  }

  if (event.cust_email) {
    cust_email = event.cust_email;
  } else {
    cust_email = 'nil';
  }

  if (event.company_name) {
    company_name = event.company_name;
  } else {
    company_name = 'ask';
  }

  var paramsForm = {
    int_rate: int_rate,
    ex_prin: ex_prin,
    input_ma: input_ma,
    term: term,
    input_term: input_term,
  };

  let results = calc.doIt(paramsForm);

  if (!results.results_display) {
    return Responses._404({ message: 'Engine Failed' });
  }

  var logSubmit = {
    type: 'engine',
    engine: engine,
    params: paramsForm,
    run_date: run_date,
    email: cust_email,
    name: cust_name,
    phone: cust_phone,
    company_name: company_name,
    doc_id: doc_id,
  };

  if (save_to_db === 'n') {
    // don't save the record
  } else {
    const tableName = process.env.DYNAMODB_TABLE;
    const logToDynamoDb = await Dynamo.write(logSubmit, tableName);
  }

  const headers = {
    'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    'Access-Control-Allow-Credentials': true, // Required for cookies, authorization headers with HTTPS
  };

  var meta = {
    version: api_version,
    engine: engine,
    date: run_date,
    email: cust_email,
    title: 'Amortization',
    doc_id: doc_id,
  };

  /**
   * this returns all of the data from buyers choice in a json object
   */
  return {
    headers,
    body: JSON.stringify({
      meta: meta,
      params: {
        pForm: paramsForm,
      },
      header: results.header,
      results: results.results_display,
      fumess: results.fumess,
    }),
    statusCode: 200,
  };
};
