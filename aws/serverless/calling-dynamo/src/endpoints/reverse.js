import { reverseString } from "../ReverseString";
import { headers } from "../common/headers";
import { meta } from "../common/meta";
import { message } from "../common/message";

export const handler = async (event, context) => {
  let alpha = "world";

  if (event.body) {
    event = JSON.parse(event.body);
  }

  if (event.alpha) {
    alpha = event.alpha;
  }

  var reversed = reverseString(alpha);

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({
      meta,
      reversed: reversed,
      message: `Go Serverless ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
    }),
  };
};
