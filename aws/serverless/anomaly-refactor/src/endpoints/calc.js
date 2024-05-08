import * as lib from "../MathLib";
import { headers } from "../common/headers";
import { meta } from "../common/meta";
import { message } from "../common/message";

export const handler = async (event, context) => {
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
