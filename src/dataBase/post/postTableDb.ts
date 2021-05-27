import AWS from "aws-sdk";

/**
 * Table Index schema {
 * address : {type :string,description : 'bitcoin address that get from sources' }
 * index : {type :string,description : 'json, object that include posts, and sources in future' }
 * version : {type : number: 'dynamoDb in any case wait string, sage version for  optimistic locking' }
 *  }
 *
 *  */

// TODO make one please to use it
AWS.config.update({
  region: "us-west-2",
});

const dynamoDbTable = new AWS.DynamoDB();

export const createTable = ({ tableName = "signed-index" }) => {
  const paramsCreate = {
    TableName: tableName,
    AttributeDefinitions: [{ AttributeName: "address", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "address", KeyType: "HASH" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
  };

  dynamoDbTable.createTable(paramsCreate, function (err: any, data: any) {
    if (err) {
      console.error("Unable to create table", err);
    } else {
      console.log("Created table", data);
    }
  });
};

export const deleteTable = ({ tableName = "signed-index" }) => {
  dynamoDbTable.deleteTable({ TableName: tableName }, function (err, data) {
    if (err) {
      console.error(
        "Unable to delete table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log(
        "Deleted table. Table description JSON:",
        JSON.stringify(data, null, 2)
      );
    }
  });
};
