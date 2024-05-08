const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient();
const uuid = require('uuid');

const Dynamo = {
  async write(data, tableName) {
    var params = {
      TableName: tableName,
      Item: {
        id: uuid.v1(),
        type: data.type,
        engine: data.engine,
        params: data.params,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.company_name,
        doc_id: data.doc_id,
        createdAt: data.run_date,
      },
    };
    const res = await documentClient.put(params).promise();
    if (!res) {
      throw Error(`There was an error writing in table ${tableName}`);
    }
    return data;
  },
};
module.exports = Dynamo;
