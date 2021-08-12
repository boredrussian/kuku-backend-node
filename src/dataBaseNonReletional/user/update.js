
const AWS = require("aws-sdk");
const { config } = require('../../config');


AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();



module.exports.updateEphemeralSecret_NonReletional = async ({
    tableName,
    userName,
    serverEphemeralSecret,
    user_relation
    
}) => {
    const userNameField = `${user_relation}-${userName}`;
    const params = {
        TableName: tableName,
        Key: {
            PK : userNameField,
            SK : userNameField,
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

module.exports.updateServerSessionProof_NonReletional = async ({
    tableName,
    userName,
    serverSessionProof,
    user_relation
}) => {
     const userNameField = `${user_relation}-${userName}`;
    const params = {
        TableName: tableName,
        Key: {
            PK : userNameField,
            SK : userNameField,
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


module.exports.updateAccessToken_NonReletional = async ({
    tableName,
    userName,
    user_relation,
    accessToken,
}) => {
    
     const userNameField = `${user_relation}-${userName}`;
     const params = {
        TableName: tableName,
          Key: {
            PK : userNameField,
            SK : userNameField,
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













module.exports.updateSubscribe = async ({
    tableName,
    address,
    subscribed
}) => {
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
        UpdateExpression: "set subscribed = :subscribed",
        ExpressionAttributeValues: {
            ":subscribed": subscribed,
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

