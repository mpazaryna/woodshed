import * as lib from "../../lib/lib";

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

const meta = {
  version: "1.0",
  engine: "anomaly-starter",
};

export const hello = async (event, context) => {
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({
      meta,
      message: `Go Serverless v2.0!! ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
    }),
  };
};

export const libcalc = async (event, context) => {
  let v = lib.easySum(1, 99);
  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({
      meta,
      calc: v,
      message: `Hello Serverless ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
    }),
  };
};

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );
