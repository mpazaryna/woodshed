import { meta, headers } from "../../lib/lib";
import { reverseString } from "./reverse";

const message = ({ time, ...rest }) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(`${rest.copy} (with a delay)`);
    }, time * 1000)
  );

export const resolve = async (event, context) => {
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
