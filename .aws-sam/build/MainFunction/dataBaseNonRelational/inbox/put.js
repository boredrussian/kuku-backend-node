const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.putMentionData = async ({
    tableName,
    address,
    id,
    post,
    status
}) => {
    
    try {
        const params = {
            TableName: tableName,
            Item: {
                address: address,
                id: id,
                post: post,
                status,
            },
        };
        await dynamoDb.put(params).promise();
    }

    catch (e) {
        console.warn("[dataBase][inbox][put][putData]", e);
    }

};




// const dynamodbParams = {
//     TableName: process.env.DYNAMODB_TABLE_BLICKANALYTICS,
//     Item: {
//         id: userId,
//         createdAt: timestamp
//     },
//     ConditionExpression: 'attribute_not_exists(id)'
// };
// dynamodb.putItem(params, function(err, data) {
//     if (err) {
//         console.log(err, err.stack);
//     } else {
//         console.log(data);
//     }
// }