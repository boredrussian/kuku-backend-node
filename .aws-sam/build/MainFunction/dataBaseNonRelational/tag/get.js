const AWS = require("aws-sdk");
const { config } = require('../../config');



AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.getTagIndex = async ({
   tableName,
   tag,
   tagRelation,
}) => {
    let tagResult
    
    const tagIndex = `${tagRelation}-${tag}`;
    const params = {
        TableName: tableName,
        Key: {
            PK: tagIndex,
            SK: tagIndex,
        },
    };
    
       const res = await dynamoDb.get(params).promise();
       if (res.Item) {
        tagResult = res.Item;
    }
  
   
    return tagResult;
};

 