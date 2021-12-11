const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB({ region: "us-east-1" });

dynamoDB
  .scan({
    TableName: "users-dev",
  })
  .promise()
  .then((data) => console.log(data.Items))
  .catch(console.error);
