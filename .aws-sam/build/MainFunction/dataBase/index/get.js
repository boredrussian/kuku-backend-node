const AWS = require("aws-sdk");
const { config } = require('../../config');



AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getIndex = async ({
    tableName,
    address,
}) => {
    let index;
    const params = {
        TableName: tableName,
        Key: {
            address: address,
        },
    };
    const res = await dynamoDb.get(params).promise();

    if (res.Item) {
        index = res.Item;
    }
    return index;
};