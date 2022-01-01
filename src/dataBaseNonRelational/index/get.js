const AWS = require("aws-sdk");
const { config } = require('../../config');


AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//     KeyConditionExpression: '#PK = :pkData and begins_with(#SK, :source_relation)',
module.exports.getIndex_NonRelational = async ({
    tableName,
    address,
    sourceRelation,
    allSourcesReletion
}) => {
    let userData;
    const sk = `${sourceRelation}-${address}`;

    const params = {
        TableName: tableName,
        KeyConditionExpression: '#PK = :pkData and #SK = :skData',
        ExpressionAttributeNames: {
            "#SK": "SK",
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ':pkData': allSourcesReletion,
            ':skData': sk,
        }
    };
    console.log(params);

    const userResData = await dynamoDb.query(params).promise();

    if (userResData?.Items && userResData?.Items?.length > 0) {
        userData = userResData?.Items[0];
    }
    return userData;
};



