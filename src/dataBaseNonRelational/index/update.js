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
  source_relation,
  currentIndex,
  newSource
}) => {
  let newIndexJson, newIndex;


  const currentVersion = currentIndex?.version;
  const newSourceJson = stringify(newSource);

  console.warn('newSource', newSource)
  console.warn('newSourceJson', newSourceJson)

  const pkValue = `${source_relation}-${newSource.address}`;
  const params = {
    TableName: tableName,
    Key: {
      PK: pkValue,
      SK: pkValue
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

  await dynamoDb.update(params).promise();
};



module.exports.updateIndexDb_NonRelational = async ({
  tableName,
  currentIndex,
  receivedPost,
  source_relation
}) => {
  let newIndexJson, postArray;

  const currentVersion = currentIndex?.version;
  const indexJson = currentIndex?.indexJson;

  try {
    postArray = parseJson(indexJson);
    if (Array.isArray(postArray)) {
      postArray.push(receivedPost);
    }

    newIndexJson = stringify(postArray);
  } catch (e) {
    console.warn("[updateIndexDb_NonRelational]", e);
  }

  const pkValue = `${source_relation}-${receivedPost.source.address}`;
  const params = {
    TableName: tableName,
    Key: {
      PK: pkValue,
      SK: pkValue
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

  await dynamoDb.update(params).promise();
};