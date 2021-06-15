const AWS = require("aws-sdk");
const { config } = require('/opt/nodejs/config');
const stringify = require("fast-json-stable-stringify");
const parseJson = require("parse-json");

AWS.config.update({
  region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const getIndex = async ({
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







exports.getIndex = async ({ address }) => {

  let currentIndex;
  try {
    currentIndex = await getIndex({ tableName: config.indexTableName, address: post.source.address });
    console.log('datadd', currentIndex)
  } catch (e) {
    console.warn("[updateIndex][getIndex]", e);
  }


};