const AWS = require("aws-sdk");
const { config } = require('../../config');

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.remoweSubscribed_NonReletional = async ({
    tableName,
    currentUserName,
    subscribedAddress,
    subscribedRelation,
    userRelation,
    }) => {
    const subscribedAddressReletional = `${subscribedRelation}-${subscribedAddress}`;
    const userNameFieldReletional = `${userRelation}-${currentUserName}`;
    const params = {
        TableName: tableName,
        Key: {
            PK : userNameFieldReletional,
            SK : subscribedAddressReletional,
        }
    };
    
    return  await dynamoDb.delete(params).promise();
};

 