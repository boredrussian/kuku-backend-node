const AWS = require("aws-sdk");
const { config } = require('../../config');
 

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.putTagIndex = async ({
    tableName,
    tag,
    tagRelation,
    indexJson,
    version
   }) => {
    const tagTitle = `${tagRelation}-${tag}`;
    try {
        const params = {
            TableName: tableName,
            Item: {
                PK: tagTitle,
                SK: tagTitle,
                indexJson,
                version
              },
        };
        await dynamoDb.put(params).promise();
    }

    catch (e) {
        console.warn("[dataBase][inbox][put][putData]", e);
    }

};


 


 