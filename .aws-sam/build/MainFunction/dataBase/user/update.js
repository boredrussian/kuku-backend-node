const AWS = require("aws-sdk");
const { config } = require('../../config');


AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateEphemeralSecret = async ({
    tableName,
    address,
    serverEphemeralSecret,
}) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
        UpdateExpression: "set serverEphemeralSecret = :serverEphemeralSecret",
        ExpressionAttributeValues: {
            ":serverEphemeralSecret": serverEphemeralSecret,
        },
        ReturnValues: "ALL_NEW",
    };
    
     const result = await dynamoDb.update(params).promise();
    return result;
};


module.exports.updateServerSessionProof = async ({
    tableName,
    address,
    serverSessionProof,
}) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
        UpdateExpression: "set serverSessionProof = :serverSessionProof",
        ExpressionAttributeValues: {
            ":serverSessionProof": serverSessionProof,
        },
        ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return result;
};


module.exports.updateAccessToken = async ({
    tableName,
    address,
    accessToken,
}) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
        UpdateExpression: "set accessToken = :accessToken",
        ExpressionAttributeValues: {
            ":accessToken": accessToken,
        },
        ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return result;
};


module.exports.updateUsersSubscribed = async ({
    tableName,
    address,
    accessToken,
}) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
        UpdateExpression: "set accessToken = :accessToken",
        ExpressionAttributeValues: {
            ":accessToken": accessToken,
        },
        ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return result;
};


module.exports.updateUser = async ({
    tableName,
    address,
    source,
   }) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
        UpdateExpression: "set #source = :newSource",
        ExpressionAttributeNames: {
      "#source": "source",
     },
        ExpressionAttributeValues: {
            ":newSource": source,
         },
        ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();
    return result;
};

