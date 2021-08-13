const AWS = require("aws-sdk");
const { config } = require('../../config');



AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getInboxByAddressCrossingId = async ({
    tableName,
    address,
    id
}) => {
    let index;
    const params = {
        TableName: tableName,
        Key: {
            address: address,
            id: id,
        },
    };
    const res = await dynamoDb.get(params).promise();
    // const res = await dynamoDb.getItem(params).promise();

    if (res.Item) {
        index = res.Item;
    }
    return index;
};

module.exports.getInboxesByAddress = async ({
    tableName,
    address,
    status
}) => {
    let index;
    const params = {
      TableName: tableName,
      KeyConditionExpression: "#address = :address",
      ExpressionAttributeNames: {
            "#address": "address",
    },
    ExpressionAttributeValues: {
           ":address": address
            }
    }
    const res = await dynamoDb.query(params).promise();

    if (res.Items) {
        index = res.Items;
    }
    return index;
};


 





// module.exports.getUserByAddress = async ({ tableName, address }) => {
//     let userResData, userResult;
//     let params = {
//         TableName: tableName,
     
//         KeyConditionExpression: "#address = :address",
//         ExpressionAttributeNames: {
//             "#address": "address",
//         },
//         ExpressionAttributeValues: {
//             ":address": address,
//         },
//          };

//     try {
//         userResData = await dynamoDb.query(params).promise();
//     }
//     catch (e) {
//         console.warn('[getUserByAddress][query]', e);
//     }

//     if (userResData?.Items && userResData.Items.length > 0) {
//         userResult = userResData.Items[0];
//     }
//     return userResult;
// };