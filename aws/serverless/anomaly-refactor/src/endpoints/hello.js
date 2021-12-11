import { headers } from "../common/headers";
import { meta } from "../common/meta";
import { message } from "../common/message";

export const handler = async (event, context) => {
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
