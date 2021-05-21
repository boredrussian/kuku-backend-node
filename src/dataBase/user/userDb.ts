import AWS from "aws-sdk";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";

/**
 * Table Index schema {
 * public-address : {type :string,description : 'public address in source, primary key ' }
 * username  : {type :string,description : 'user login' }
 * wif : {type : string: 'encrypt ' }
 * token : {type : string: 'dynamoDb in any case wait string, sage version for  optimistic locking' }
 *  }
 *
 *  */

AWS.config.update({
  region: "us-west-2",
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const dynamoDbTable = new AWS.DynamoDB();
