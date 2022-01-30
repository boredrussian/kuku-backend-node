const AWS = require("aws-sdk");
const { config } = require('config');

AWS.config.update({
    region: config.region,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = config.signedTableName;

// ## Internal DB API
// - putItem(Item)
// - getItem(PK, SK)
// - getItems(PK, fromSK, toSK)
// - implements paging internally 
// - delete([PK, SK]) - deletes in batches of 25

module.exports.putItem = async ({ Item }) => {
    const params = { TableName, Item };
    try {
        await dynamoDb.put(params).promise();
        return true;
    }
    catch (e) {
        console.warn("putItem failed", e);
        return false;
    }
};

module.exports.getItem = async ({ PK, SK }) => {
    const params = {
        TableName,
        Key: {PK, SK}
    };
    try {
        const res = await dynamoDb.get(params).promise();
        if('Item' in res) {
            return res.Item;
        }
    }
    catch (e) {
        console.warn("getItem failed", params, e);
    }
    return false;
};

module.exports.getItems = async ({ PK, fromSK, toSK }) => {
    let ExpressionAttributeValues = {
        ':PK': PK
    };
    let KeyConditionExpression = '#PK = :PK'
    const ExpressionAttributeNames = {
        "#PK": "PK"
    };
    if (fromSK) {
        ExpressionAttributeValues[':fromSK'] = fromSK;
        KeyConditionExpression += " and #SK >= :fromSK";
        ExpressionAttributeNames['#SK'] = 'SK';
    };
    if (toSK) {
        ExpressionAttributeValues[':toSK'] = toSK;
        KeyConditionExpression += " and #SK < :toSK";
        ExpressionAttributeNames['#SK'] = 'SK';
    }
    var params = {
        ExpressionAttributeValues,
        KeyConditionExpression,
        TableName,
        ExpressionAttributeNames
    };

    try {
        const queryResult = await dynamoDb.query(params).promise();

        let items = queryResult.Items;
        while (queryResult.LastEvaluatedKey) {
            console.log("LastEvaluatedKey: ", queryResult.LastEvaluatedKey);
            params.ExpressionAttributeValues[':lastEvaluatedKey'] = queryResult.LastEvaluatedKey.SK;
            params.KeyConditionExpression = KeyConditionExpression + " AND #SK > :lastEvaluatedKey";
            params.ExpressionAttributeNames['#SK'] = 'SK';
            queryResult = await dynamoDb.query(params).promise();
            // console.log(queryResult)
            items = items.concat(queryResult.Items);
        }

        return items;
    }
    catch (e) {
        console.warn("getItems failed", e);
        return false;
    }
};
