const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");


AWS.config.update({
  region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

 
 module.exports.updateInboxItem_NonRelation = async ({
    tableName,
    address,
    id,
    newStatus,
    authorAddress,
    destinationAddress,
    sourceRelation,
    inboxPostRelation,
    inboxRelation
}) => {
    
    const pkSourceAddress = `${sourceRelation}-${inboxRelation}-${destinationAddress}`;
    const skDestinationId = `${inboxPostRelation}-${authorAddress}-${id}`;
    
    const params = {
        TableName: tableName,
        Key: {
            PK: pkSourceAddress,
            SK: skDestinationId
        },
     UpdateExpression: "set #status = :newStatus",
        ExpressionAttributeNames: {
       "#status": "status",
    },
        ExpressionAttributeValues: {
            ":newStatus": newStatus,
        },
        ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return result;
};

 
 