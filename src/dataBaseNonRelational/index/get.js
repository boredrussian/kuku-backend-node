const AWS = require("aws-sdk");
const { config } = require('../../config');



AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.getIndex_NonRelational = async ({
    tableName,
    address,
    sourceRelation
}) => {
    let userData;
    const pk = `${sourceRelation}-${address}`;

    const params = {
        TableName: tableName,
        KeyConditionExpression: '#PK = :pkData and begins_with(#SK, :source_relation)',
        ExpressionAttributeNames: {
            "#SK": "SK",
            "#PK": "PK",
        },
        ExpressionAttributeValues: {
            ':pkData': pk,
            ':source_relation': sourceRelation,
        }
    };


    const userResData = await dynamoDb.query(params).promise();

    if (userResData?.Items && userResData?.Items?.length > 0) {
        userData = userResData?.Items[0];
    }
    return userData;
};



