const AWS = require("aws-sdk");
const { config } = require('../../config');

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getUserByUserName_NonRelational = async ({ tableName, userName, user_relation }) => {
    let userResData, userResult;

    const pkData = `${user_relation}-${userName}`;

    let params = {
        TableName: tableName,
        Key: {
            PK: pkData,
            SK: pkData
        },

    };

    try {
        userResData = await dynamoDb.get(params).promise();
    }
    catch (e) {
        console.warn('[getUserByLogin][query]', e);
    }
    if (userResData?.Item) {
        userResult = userResData.Item;
    }
    return userResult;
};


module.exports.getUserNameByAddress_NonRelational = async ({ tableName, address, user_relation, source_relation }) => {
    let userResData, userResult;

    const skData = `${source_relation}-${address}`;

    let params = {
        TableName: tableName,
        IndexName: "Inverted-GSI",
        KeyConditionExpression: "#SK = :userAddress and begins_with(#PK, :user_relation)",
        ExpressionAttributeNames: {
            "#SK": "SK",
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ":userAddress": skData,
            ":user_relation": user_relation,
        },
    };

    try {
        userResData = await dynamoDb.query(params).promise();
    }
    catch (e) {
        console.warn('[getUserByLogin][query]', e);
    }

    if (userResData?.Items) {
        userResult = userResData.Items[0].PK;
    }
    return userResult;
};



module.exports.getUsers_NonRelational = async ({ tableName, source_relation }) => {
    let result;

    let params = {
        TableName: tableName,
        FilterExpression: "begins_with(#SK, :source_relation) and begins_with(#PK, :source_relation)",
        ExpressionAttributeNames: {
            "#SK": "SK",
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ':source_relation': source_relation
        }
    };

    let queryResult = await dynamoDb.scan(params).promise();
    if (queryResult?.Items && queryResult?.Items?.length > 0) {
        result = queryResult?.Items;
    }
    return result;
};





module.exports.getSubscribed_NonRelational = async ({ tableName, subscribed_relation, userName, user_relation }) => {
    let result;

    const pkData = `${user_relation}-${userName}`;



    const params = {
        TableName: tableName,
        KeyConditionExpression: '#PK = :pkData and begins_with(#SK, :subscribed_relation)',
        ExpressionAttributeNames: {
            "#SK": "SK",
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ':pkData': pkData,
            ':subscribed_relation': 'subscribed',
        }
    };

    let queryResult = await dynamoDb.query(params).promise();

    if (queryResult?.Items && queryResult?.Items?.length > 0) {
        result = queryResult?.Items;
    }
    return result;
};


