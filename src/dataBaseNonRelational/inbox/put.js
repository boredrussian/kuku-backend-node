const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.putInboxPost_NonRelational = async ({
    tableName,
    mentionedUserAddress,
    authorPostAddress,
    postId,
    postJson,
    status,
    sourceRelation,
    inboxRelation,
    inboxPostRelation,
    createdAt
   }) => {
    
    const userMentonedAddress = `${sourceRelation}-${inboxRelation}-${mentionedUserAddress}`;
    const destinationAddressId = `${inboxPostRelation}-${authorPostAddress}-${postId}`;
    
     try {
        const params = {
            TableName: tableName,
            Item: {
                PK: userMentonedAddress,
                SK: destinationAddressId,
                postJson,
                status,
                createdAt 
            },
        };
        await dynamoDb.put(params).promise();
    }

    catch (e) {
        console.warn("[dataBase][inbox][put][putData]", e);
    }

};


module.exports.putInboxMentionAuthor_NonRelational = async ({
    tableName,
    authorPostAddress,
    postId,
    sourceRelation,
    inboxPostRelation,
    }) => {
    
    const destinationAddressId = `${inboxPostRelation}-${authorPostAddress}-${postId}`;
    const authorAddress = `${sourceRelation}-${authorPostAddress}`;
    
    try {
        const params = {
            TableName: tableName,
            Item: {
                PK: destinationAddressId,
                SK: authorAddress,
        },
        };
        await dynamoDb.put(params).promise();
    }
    catch (e) {
        console.warn("[dataBase][inbox][put][putData]", e);
    }

};



