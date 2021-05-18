import AWS from "aws-sdk";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";

AWS.config.update({
  region: "us-west-2",
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

const putData = async ({
  tableName = "signed-index",
  data,
  address,
  version,
}: Type_UpdateData) => {
  const params = {
    TableName: tableName,
    Item: {
      address: address,
      index: stringify(data),
      version: version,
    },
  };
  await dynamoDb.put(params).promise();
};

export const getIndex = async ({
  tableName = "signed-index",
  address,
}: Type_GetData) => {
  let res: any = "fdf";

  const params = {
    TableName: tableName,
    Key: {
      address: address,
    },
  };

  //   dynamoDb.get(params, function (err, data) {
  //     if (err) {
  //       console.error(
  //         "Unable to read item. Error JSON:",
  //         JSON.stringify(err, null, 2)
  //       );
  //     } else {
  //       console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
  //       res = data;
  //     }
  //   });

  const data = await dynamoDb.get(params).promise();
  console.log("data", data);
  return data;
};

export const updateIndexDb = async ({
  tableName = "signed-index",
  data,
  address,
  version,
}: Type_UpdateData) => {
  const lastData = getIndex({ address: "testHash" });
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
