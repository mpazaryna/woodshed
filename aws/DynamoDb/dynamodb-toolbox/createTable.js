const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });

const { Table, Entity } = require("dynamodb-toolbox");
// Require AWS SDK and instantiate DocumentClient
const DynamoDB = require("aws-sdk/clients/dynamodb");
const DocumentClient = new AWS.DynamoDB.DocumentClient();

// Instantiate a table
const MyTable = new Table({
  // Specify table name (used by DynamoDB)
  name: "my-table",

  // Define partition and sort keys
  partitionKey: "pk",
  sortKey: "sk",

  // Add the DocumentClient
  DocumentClient,
});

