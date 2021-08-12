const AWS = require("aws-sdk");
const { config } = require('../../config');

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.remoweSubscribed_NonRelational = async ({
    tableName,
    currentUserName,
    subscribedAddress,
    subscribedRelation,
    userRelation,
}) => {
    const subscribedAddressRelational = `${subscribedRelation}-${subscribedAddress}`;
    const userNameFieldRelational = `${userRelation}-${currentUserName}`;
    const params = {
        TableName: tableName,
        Key: {
            PK: userNameFieldRelational,
            SK: subscribedAddressRelational,
        }
    };

    return await dynamoDb.delete(params).promise();
};

