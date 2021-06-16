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

    if (userResData.Items && userResData.Items.length > 0) {
        userResult = userResData.Items[0];
    }
    return userResult;
};