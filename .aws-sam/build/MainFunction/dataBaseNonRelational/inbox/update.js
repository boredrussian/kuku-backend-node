const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");



AWS.config.update({
  region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

 
 
 module.exports.updateStatus = async ({
    tableName,
    address,
    id,
    status
}) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
            id: id
        },
     UpdateExpression: "set #st = :newStatus",
        ExpressionAttributeValues: {
            ":newStatus": status,
        },
        ExpressionAttributeNames: {
       "#st": "status",
    },
        ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return result;
};

 
 