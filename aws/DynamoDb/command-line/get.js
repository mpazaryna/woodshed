const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
const dynamoDB = new AWS.DynamoDB.DocumentClient();

dynamoDB
  .get({
    TableName: "users-dev",
    Key: {
      cognito_id: "7d3b2ef0-56b6-11ec-8de3-430fc5ae989e", // id is the Partition Key, '123' is the value of it
    },
  })
  .promise()
  .then((data) => console.log(data.Item))
  .catch(console.error);
