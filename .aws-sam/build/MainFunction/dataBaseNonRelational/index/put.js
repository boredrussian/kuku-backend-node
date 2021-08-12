const AWS = require("aws-sdk");
const { config, prefixes } = require('../../config');
const stringify = require("fast-json-stable-stringify");

AWS.config.update({
    region: config.region,
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();


 



 