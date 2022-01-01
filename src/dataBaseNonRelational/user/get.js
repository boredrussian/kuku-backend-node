const AWS = require("aws-sdk");
const { config } = require('../../config');

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getUserByUserName_NonRelational = async ({ tableName, userName, userRelation }) => {
    let userResData, userResult;

    const pkData = `${userRelation}-${userName}`;

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


module.exports.getUserNameByAddress_NonRelational = async ({ tableName, address, userRelation, sourceRelation }) => {
    let userResData, userResult;

    const skData = `${sourceRelation}-${address}`;

    let params = {
        TableName: tableName,
        IndexName: "Inverted-GSI",
        KeyConditionExpression: "#SK = :userAddress and begins_with(#PK, :userRelation)",
        ExpressionAttributeNames: {
            "#SK": "SK",
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ":userAddress": skData,
            ":userRelation": userRelation,
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

module.exports.getUsers_NonRelational = async ({ tableName, sourceRelation, allSourcesReletion }) => {
    let result = [];
    console.log('123allSourcesReletion[getUsers_NonRelational]', allSourcesReletion);

    let params = {
        TableName: tableName,
        KeyConditionExpression: "#PK = :allSourcesRelation and begins_with(#SK, :sourceRelation)",
        ExpressionAttributeNames: {
            "#PK": "PK",
            "#SK": "SK",
        },
        ExpressionAttributeValues: {
            ':sourceRelation': "source-1EQBTachaCgQtBR1dJodJEEgD5mKAyUrEv",
            ':allSourcesRelation': allSourcesReletion
        }
    };

    let queryResult = await dynamoDb.query(params).promise();
    let items = queryResult.Items;
    while (queryResult.LastEvaluatedKey) {
        console.log("LastEvaluatedKey: ", queryResult.LastEvaluatedKey)
        params = {
            TableName: tableName,
            KeyConditionExpression: "#PK = :allSourcesRelation and #SK > :lastEvaluatedKey",
            ExpressionAttributeNames: {
                "#PK": "PK",
                "#SK": "SK",
            },
            ExpressionAttributeValues: {
                ':lastEvaluatedKey': queryResult.LastEvaluatedKey.SK,
                ':allSourcesRelation': allSourcesReletion
            }
        };
        // console.log(params);
        queryResult = await dynamoDb.query(params).promise();
        // console.log(queryResult)
        items = items.concat(queryResult.Items);
    }

    return items;
};





module.exports.getSubscribed_NonRelational = async ({ tableName, subscribedRelation, userName, userRelation }) => {
    let result = [];

    const pkData = `${userRelation}-${userName}`;



    const params = {
        TableName: tableName,
        KeyConditionExpression: '#PK = :pkData and begins_with(#SK, :subscribedRelation)',
        ExpressionAttributeNames: {
            "#SK": "SK",
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ':pkData': pkData,
            ':subscribedRelation': subscribedRelation,
        }
    };

    let queryResult = await dynamoDb.query(params).promise();

    if (queryResult?.Items && queryResult?.Items?.length > 0) {
        result = queryResult?.Items;
    }
    return result;
};


