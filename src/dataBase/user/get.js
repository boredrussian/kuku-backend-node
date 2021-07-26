const AWS = require("aws-sdk");
const { config } = require('../../config');

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getUserByLogin = async ({ tableName, login }) => {
    let userResData, userResult;
    let params = {
        TableName: tableName,
        IndexName: "login_index",
        KeyConditionExpression: "#login = :login",
        ExpressionAttributeNames: {
            "#login": "login",
        },
        ExpressionAttributeValues: {
            ":login": login,
        },
    };

    try {
        userResData = await dynamoDb.query(params).promise();
    }
    catch (e) {
        console.warn('[getUserByLogin][query]', e);
    }

    if (userResData?.Items && userResData.Items.length > 0) {
        userResult = userResData.Items[0];
    }
    return userResult;
};



module.exports.getUserByAccessToken = async ({ tableName, token }) => {
    let result;
    const params = {
        TableName: tableName,
        IndexName: "accessToken_index",
        KeyConditionExpression: "#accessToken = :accessToken",
        ExpressionAttributeNames: {
            "#accessToken": "accessToken",
        },
        ExpressionAttributeValues: {
            ":accessToken": token,
        },
    };

    let queryResult = await dynamoDb.query(params).promise();

    if (queryResult?.Items && queryResult?.Items?.length > 0) {
        result = queryResult?.Items[0];
    }
    return result;
};


module.exports.getUsers = async ({ tableName }) => {
    let result;

    const params = {
        TableName: tableName,
        Select: "ALL_ATTRIBUTES"
    };

    let queryResult = await dynamoDb.scan(params).promise();

    if (queryResult?.Items && queryResult?.Items?.length > 0) {
        result = queryResult?.Items;
    }
    return result;
};