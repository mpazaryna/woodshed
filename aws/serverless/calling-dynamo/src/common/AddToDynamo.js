const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");

const AddToDynamo = {
  async write(data, tableName) {
    var params = {
      TableName: tableName,
      Item: {
        id: uuid.v1(),
        engine: data.engine,
      },
    };
    const res = await documentClient.put(params).promise();
    if (!res) {
      throw Error(`There was an error writing in table ${tableName}`);
    }
    return data;
  },
};

export { AddToDynamo };
