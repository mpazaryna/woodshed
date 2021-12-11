const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

dynamoDB
  .update({
    TableName: "users-dev",
    Key: {
      id: "7d3b2ef0-56b6-11ec-8de3-430fc5ae989e",
    },
    UpdateExpression: `set brokerage = :brokerage`,
    ExpressionAttributeValues: {
      ":brokerage": "John McNewname II",
    },
  })
  .promise()
  .then((data) => console.log(data.Attributes))
  .catch(console.error);
