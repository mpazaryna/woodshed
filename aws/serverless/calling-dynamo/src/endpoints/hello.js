import { headers } from "../common/headers";
import { meta } from "../common/meta";
import { message } from "../common/message";
import { AddToDynamo } from "../common/AddToDynamo";

var logSubmit = {
  type: "engine",
  engine: "hello-world",
};

export const handler = async (event, context) => {
  if (event.body) {
    event = JSON.parse(event.body);
  }

  if (event.save_to_db === "n") {
    // don't save the record
  } else {
    const tableName = process.env.DYNAMODB_TABLE;
    var logToDynamoDb = await AddToDynamo.write(logSubmit, tableName);
  }

  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({
      meta,
      logToDynamoDb,
      message: `Go Serverless v2.0!! ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
    }),
  };
};
