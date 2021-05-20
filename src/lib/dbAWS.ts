import AWS from "aws-sdk";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";
// import awsConfig from "../../awsSecureConfig/config";

/**
 * Table Index schema {
 * address : {type :string,description : 'bitcoin address that get from sources' }
 * index : {type :string,description : 'json, object that include posts, and sources in future' }
 * version : {type : number: 'dynamoDb in any case wait string, sage version for  optimistic locking' }
 *  }
 *
 *  */

AWS.config.update({
  region: "us-west-2",
  // accessKeyId: awsConfig.accessKeyId,
  // secretAccessKey: awsConfig.secretAccessKey,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();
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

interface Type_UpdateData {
  tableName?: string;
  data: any;
  address: string;
  version?: number;
}

interface Type_GetData {
  tableName?: string;
  address: string;
}

export const putData = async ({
  tableName = "signed-index",
  data,
  address,
  version,
}: Type_UpdateData) => {
  const params = {
    TableName: tableName,
    Item: {
      address: address,
      indexStore: stringify(data),
      version: version,
    },
  };
  await dynamoDb.put(params).promise();
};

export const getIndex = async ({
  tableName = "signed-index",
  address,
}: Type_GetData) => {
  let res: any;

  const params = {
    TableName: tableName,
    Key: {
      address: address,
    },
  };
  const data = await dynamoDb.get(params).promise();
  return data;
};

export const updateIndexDb = async ({
  tableName = "signed-index",
  data,
  address = "testHash",
  version,
}: Type_UpdateData) => {
  let postsObject, newIndexJson;
  const currentData = await getIndex({ address: "testHash" });
  const currentVersion = currentData?.Item?.version;
  const indexJson = currentData?.Item?.indexStore;

  try {
    const indexObject = parseJson(indexJson);
    const postArray = indexObject.posts;
    if (Array.isArray(postArray)) {
      postArray.push(data);
    }
    indexObject.posts = postArray;
    newIndexJson = stringify(indexObject);
  } catch (e) {
    console.warn("[updateIndexDb]", e);
  }

  const params = {
    // Get the table name from the environment variable
    TableName: tableName,
    // Get the row where the noteId is the one in the path
    Key: {
      address: address,
    },
    // Update the "content" column with the one passed in
    UpdateExpression: "SET #indexStore = :newIndexStore, #version = :version",
    ConditionExpression: "#version = :expectedVersion",
    ExpressionAttributeNames: {
      "#indexStore": "indexStore",
      "#version": "version",
    },
    ExpressionAttributeValues: {
      // ":indexStore": '{ "posts": [] }',
      ":newIndexStore": newIndexJson,
      ":version": currentVersion + 1,
      ":expectedVersion": currentVersion,
    },
    ReturnValues: "ALL_NEW",
  };

  const results = await dynamoDb.update(params).promise();
  console.log("results", results);
};

export const deleteTable = ({ tableName = "signed-index" }) => {
  // const results = await dynamoDb.update(params).promise();
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
