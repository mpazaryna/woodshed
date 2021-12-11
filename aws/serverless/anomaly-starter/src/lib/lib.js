function easySum(a, b) {
  return a + b;
}

function easyMod(a, b) {
  return a % b;
}

const meta = {
  version: "1.0",
  engine: "anomaly-starter",
};

const headers = {
  "Access-Control-Allow-Origin": "*", // Required for CORS support to work
  "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
};

export { easyMod, easySum, meta, headers };
