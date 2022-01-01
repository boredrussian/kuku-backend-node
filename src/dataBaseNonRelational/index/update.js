const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");


AWS.config.update({
  region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


// tableName: config.signedTableName, newSource: source, source_relation : prefixes.source
module.exports.updateIndexSource_NonRelational = async ({
  tableName,
  sourceRelation,
  currentIndex,
  newSource,
  allSourcesReletion
}) => {
  let newIndexJson, newIndex;

  const currentVersion = currentIndex?.version;
  const newSourceJson = stringify(newSource);


  const skValue = `${sourceRelation}-${newSource.address}`;
  const params = {
    TableName: tableName,
    Key: {
      PK: allSourcesReletion,
      SK: skValue
    },

    UpdateExpression: "SET #sourceJson = :newSourceJson, #version = :version",
    ConditionExpression: "#version = :expectedVersion",
    ExpressionAttributeNames: {
      "#sourceJson": "sourceJson",
      "#version": "version",
    },
    ExpressionAttributeValues: {
      ":newSourceJson": newSourceJson,
      ":version": currentVersion + 1,
      ":expectedVersion": currentVersion,
    },
    ReturnValues: "ALL_NEW",
  };

try {
 await dynamoDb.update(params).promise();
}catch(e){
   console.warn('[updateIndexSource_NonRelational]', newIndexJson);
}
 
};



module.exports.updateIndexDb_NonRelational = async ({
  tableName,
  currentIndex,
  address,
  receivedPost,
  sourceRelation,
  allSourcesReletion
}) => {
  let newIndexJson, postArray, recentPostArray, indexObject;

  const currentVersion = currentIndex?.version;
  const indexJson = currentIndex?.indexJson;

 

  try {
    indexObject = parseJson(indexJson);
    recentPostArray = indexObject.recentPosts;
    
    if (Array.isArray(recentPostArray)) {
      recentPostArray.push(receivedPost);
    }

    indexObject.recentPosts = recentPostArray;
    newIndexJson = stringify(indexObject);
 
  } catch (e) {
    console.warn("[updateIndexDb_NonRelational]", e);
  }

  const skValue = `${sourceRelation}-${address}`;
 
  const params = {
    TableName: tableName,
    Key: {
      PK: allSourcesReletion,
      SK: skValue
    },

    UpdateExpression: "SET #indexJson = :newIndexJson, #version = :version",
    ConditionExpression: "#version = :expectedVersion",
    ExpressionAttributeNames: {
      "#indexJson": "indexJson",
      "#version": "version",
    },
    ExpressionAttributeValues: {
      ":newIndexJson": newIndexJson,
      ":version": currentVersion + 1,
      ":expectedVersion": currentVersion,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
  const res = await dynamoDb.update(params).promise();
  
  return true;
  
  }catch(e){
   console.warn("[updateIndexDb_NonRelational][dynamoDb.update]", e);
   
   return false;
   
  }

 
 
};


      // tableName: config.signedTableName,
      // address: indexAddress,
      // indexObject,
      // currentIndex,
      // sourceRelation: prefixes.source,
      // allSourcesReletion: prefixes.allSources

module.exports.updateIndexArchive = async ({
  tableName,
  currentIndex,
  address,
  indexObject,
  sourceRelation,
  allSourcesReletion
}) => {
 const currentVersion = currentIndex?.version;
 const newIndexJson = stringify(indexObject);
  
 const skValue = `${sourceRelation}-${address}`;
 
 const params = {
    TableName: tableName,
    Key: {
      PK: allSourcesReletion,
      SK: skValue
 },

    UpdateExpression: "SET #indexJson = :newIndexJson, #version = :version",
    ConditionExpression: "#version = :expectedVersion",
    ExpressionAttributeNames: {
      "#indexJson": "indexJson",
      "#version": "version",
    },
    ExpressionAttributeValues: {
      ":newIndexJson": newIndexJson,
      ":version": currentVersion + 1,
      ":expectedVersion": currentVersion,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
  await dynamoDb.update(params).promise();
  return true;
  }
  catch(e){
   console.warn("[updateIndexDb_NonRelational][dynamoDb.update]", e);
   return false;
  }

 
 
};