const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");


AWS.config.update({
  region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

 
 module.exports.updateTagIndex = async ({
    tableName,
    tag,
    currentTagIndex,
    tagRelation,
    post,
    currentVersion
}) => {
    
  const tagIndex = `${tagRelation}-${tag}`;
 
  currentTagIndex.push(post)
  
 
  
    const params = {
        TableName: tableName,
        Key: {
            PK: tagIndex,
            SK: tagIndex
        },
     UpdateExpression: "set #indexJson = :newIndexJson, #version = :version",
     ConditionExpression: "#version = :expectedVersion",
        ExpressionAttributeNames: {
       "#indexJson": "indexJson",
       "#version": "version",
    },
        ExpressionAttributeValues: {
            ":newIndexJson": stringify(currentTagIndex),
            ":version": currentVersion + 1,
            ":expectedVersion": currentVersion,
        },
        ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return result;
};

 
 