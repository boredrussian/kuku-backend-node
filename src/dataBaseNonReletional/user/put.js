const AWS = require("aws-sdk");
const { config, prefixes } = require('../../config');


AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.addUser_NonReletional = async ({
    tableName,
    address,
    encryptedWif,
    salt,
    verifier,
    login,
    accessToken,
    source
}) => {
    
    const pk = `${prefixes.user}-${login}`;
    const sk = `${prefixes.user}-${login}`;
   
    const params = {
        TableName: tableName,
        Item: {
            PK: pk,
            SK: sk,
            address,
            encryptedWif,
            salt,
            verifier,
            login,
            accessToken,
            source
        },
    };
    
    
    
    return await dynamoDb.put(params).promise();
};


module.exports.addUserSourceReletion_NonReletional = async ({
    tableName,
    address,
    login,
    }) => {
    
    const pk = `${prefixes.user}-${login}`;
    const sk = `${prefixes.source}-${address}`;
   
    const params = {
        TableName: tableName,
        Item: {
            PK: pk,
            SK: sk,
           },
    };
    
    
    
    return await dynamoDb.put(params).promise();
};



module.exports.putSourceAndIndexInitial_NonReletional = async ({
    tableName,
    address,
    sourceJson,
    indexJsonInitial,
    version
}) => {

 const pk = `${prefixes.source}-${address}`;
 const sk = `${prefixes.source}-${address}`;

    try {
        const params = {
            TableName: tableName,
            Item: {
                PK: pk,
                SK: sk,
                sourceJson: sourceJson,
                indexJson: indexJsonInitial,
                version: version,
            },
        };
        
     await dynamoDb.put(params).promise();
    }

    catch (e) {
        console.warn("[updateIndex][putFirstDataPost][dataBase]", e);
    }

};

 
module.exports.setUserSubscribed_NonReletional = async ({
    tableName,
    currentUserName,
    subscribedAddress,
    subscribed_relation,
    user_relation 
    }) => {

 const pk = `${user_relation}-${currentUserName}`;
 const sk = `${subscribed_relation}-${subscribedAddress}`;

    try {
        const params = {
            TableName: tableName,
            Item: {
                PK: pk,
                SK: sk,
            },
        };
     console.warn('params-----23232323--------params', params);
     await dynamoDb.put(params).promise();
    }

    catch (e) {
        console.warn("[updateIndex][putFirstDataPost][dataBase]", e);
    }

};