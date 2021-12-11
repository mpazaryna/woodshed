const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

dynamoDB
  .scan({
    TableName: "users-dev",
    FilterExpression: "contains(brokerage_state, :brokerage_state)",
    ExpressionAttributeValues: {
      ":brokerage_state": "al",
    },
  })
  .promise()
  .then((data) => console.log(data.Items))
  .catch(console.error);
