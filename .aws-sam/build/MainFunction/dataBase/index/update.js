const AWS = require("aws-sdk");
const { config } = require('../../config');
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");


AWS.config.update({
  region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateIndexDb = async ({
  tableName,
  currentIndex,
  receivedPost
}) => {
  let newIndexJson;

  const currentVersion = currentIndex?.version;
  const indexJson = currentIndex?.index;
  const address = currentIndex?.address;

  try {
    const indexObject = parseJson(indexJson);
    const postArray = indexObject.posts;
    if (Array.isArray(postArray)) {
      postArray.push(receivedPost);
    }
    indexObject.posts = postArray;
    newIndexJson = stringify(indexObject);
  } catch (e) {
    console.warn("[updateIndexDb]", e);
  }

  const params = {
    TableName: tableName,
    Key: {
      address: address,
    },
    UpdateExpression: "SET #index = :newIndex, #version = :version",
    ConditionExpression: "#version = :expectedVersion",
    ExpressionAttributeNames: {
      "#index": "index",
      "#version": "version",
    },
    ExpressionAttributeValues: {
      // ":index": '{ "posts": [] }',
      ":newIndex": newIndexJson,
      ":version": currentVersion + 1,
      ":expectedVersion": currentVersion,
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params).promise();
};


module.exports.updateIndexUserSource = async ({
  tableName,
  currentIndex,
  newSource
}) => {
  let newIndexJson, newIndex;

  const currentVersion = currentIndex?.version;
  const indexJson = currentIndex?.index;
  const address = currentIndex?.address;
  const source = currentIndex?.source;

  try {
    const indexObject = parseJson(indexJson);
     indexObject.source = newSource;
      newIndexJson = stringify(indexObject);
  } catch (e) {
    console.warn("[updateIndexDb]", e);
  }

  const params = {
    TableName: tableName,
    Key: {
      address: address,
    },
    UpdateExpression: "SET #index = :newIndex, #version = :version",
    ConditionExpression: "#version = :expectedVersion",
    ExpressionAttributeNames: {
      "#index": "index",
      "#version": "version",
    },
    ExpressionAttributeValues: {
      // ":index": '{ "posts": [] }',
      ":newIndex": newIndexJson,
      ":version": currentVersion + 1,
      ":expectedVersion": currentVersion,
    },
    ReturnValues: "ALL_NEW",
  };

  await dynamoDb.update(params).promise();
};