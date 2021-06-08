import AWS from "aws-sdk";
import { Request, Response, NextFunction } from "express";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";
import { getJSDocReturnTag } from "typescript";
import createError from "http-errors";

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

interface Type_CreateTable {
  tableName?: string;
}

export const createTable = ({ tableName = "users" }: Type_CreateTable) => {
  const paramsCreate = {
    TableName: tableName,
    AttributeDefinitions: [
      { AttributeName: "address", AttributeType: "S" },
      { AttributeName: "login", AttributeType: "S" },
      { AttributeName: "accessToken", AttributeType: "S" },
      { AttributeName: "refreshToken", AttributeType: "S" },
    ],
    KeySchema: [{ AttributeName: "address", KeyType: "HASH" }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10,
    },
    GlobalSecondaryIndexes: [
      {
        IndexName: "login_index",
        KeySchema: [
          {
            AttributeName: "login",
            KeyType: "HASH",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          WriteCapacityUnits: 5,
          ReadCapacityUnits: 10,
        },
      },
      {
        IndexName: "accessToken_index",
        KeySchema: [
          {
            AttributeName: "accessToken",
            KeyType: "HASH",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          WriteCapacityUnits: 5,
          ReadCapacityUnits: 10,
        },
      },
      {
        IndexName: "refreshToken_index",
        KeySchema: [
          {
            AttributeName: "refreshToken",
            KeyType: "HASH",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
        ProvisionedThroughput: {
          WriteCapacityUnits: 5,
          ReadCapacityUnits: 10,
        },
      },
    ],
  };

  dynamoDbTable.createTable(paramsCreate, function (err: any, data: any) {
    if (err) {
      console.error("Unable to create table", err);
    } else {
      console.log("Created table", data);
    }
  });
};

interface Type_PutData {
  tableName?: string;
  address: string;
  encryptedWif: string;
  salt: string;
  privateKey: string;
  verifier: string;
  login: string;
  accessToken: string;
}

export const putData = async ({
  tableName = "users",
  address,
  encryptedWif,
  salt,
  privateKey,
  verifier,
  login,
  accessToken,
}: Type_PutData) => {
  const params = {
    TableName: tableName,
    Item: {
      address,
      encryptedWif,
      salt,
      privateKey,
      verifier,
      login,
      accessToken,
    },
  };
  await dynamoDb.put(params).promise();
};

export const getUserByLogin = async ({ login }: { login: string }) => {
  const params = {
    TableName: "users",
    IndexName: "login_index",
    KeyConditionExpression: "#login = :login",
    ExpressionAttributeNames: {
      "#login": "login",
    },
    ExpressionAttributeValues: {
      ":login": login,
    },
  };
  const userResData = await dynamoDb.query(params).promise();

  if (userResData.Items && userResData.Items.length > 0) {
    return userResData.Items[0];
  }
};

export const isFreeLogin = async ({ login, next }: any) => {
  let isFreeLogin: boolean, user;
  const params = {
    TableName: "users",
    IndexName: "login_index",
    KeyConditionExpression: "#login = :login",
    ExpressionAttributeNames: {
      "#login": "login",
    },
    ExpressionAttributeValues: {
      ":login": login,
    },
  };

  try {
    user = await getUserByLogin({ login: login });
    if (user) {
      isFreeLogin = false;
    } else {
      isFreeLogin = true;
    }
    return isFreeLogin;
  } catch (e) {
    console.warn("isFreeLogin", e);
    return next(createError(403, "Error is free login"));
  }
};

export const getUserByAccessToken = async ({ token }: { token: string }) => {
  console.log("============token============", token);
  const params = {
    TableName: "users",
    IndexName: "accessToken_index",
    KeyConditionExpression: "#accessToken = :accessToken",
    ExpressionAttributeNames: {
      "#accessToken": "accessToken",
    },
    ExpressionAttributeValues: {
      ":accessToken": token,
    },
  };

  let queryResult = await dynamoDb.query(params).promise();
  console.log("--------queryResult----------", queryResult);

  if (queryResult?.Items && queryResult?.Items?.length > 0) {
    return queryResult?.Items[0];
  }
};
interface Type_UpdateUser_AddEphemeralSecret {
  tableName?: string;
  address: string;
  serverEphemeralSecret: string;
}

// updateUserByAddress
// updateUserAddEphemeralSecret
export const updateUser_AddEphemeralSecret = async ({
  tableName = "users",
  address,
  serverEphemeralSecret,
}: Type_UpdateUser_AddEphemeralSecret) => {
  const params = {
    TableName: "users",
    Key: {
      address: address,
    },
    UpdateExpression: "set serverEphemeralSecret = :serverEphemeralSecret",
    ExpressionAttributeValues: {
      ":serverEphemeralSecret": serverEphemeralSecret,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDb.update(params).promise();
  return result;
};

interface Type_UpdateUser_ServerSessionProof {
  tableName?: string;
  address: string;
  serverSessionProof: string;
}

export const updateUser_ServerSessionProof = async ({
  tableName = "users",
  address,
  serverSessionProof,
}: Type_UpdateUser_ServerSessionProof) => {
  const params = {
    TableName: "users",
    Key: {
      address: address,
    },
    UpdateExpression: "set serverSessionProof = :serverSessionProof",
    ExpressionAttributeValues: {
      ":serverSessionProof": serverSessionProof,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDb.update(params).promise();
  return result;
};

interface Type_UpdateUser_AccessToken {
  tableName?: string;
  address: string;
  accessToken: string;
}

export const updateUser_AccessToken = async ({
  tableName = "users",
  address,
  accessToken,
}: Type_UpdateUser_AccessToken) => {
  const params = {
    TableName: "users",
    Key: {
      address: address,
    },
    UpdateExpression: "set accessToken = :accessToken",
    ExpressionAttributeValues: {
      ":accessToken": accessToken,
    },
    ReturnValues: "ALL_NEW",
  };

  const result = await dynamoDb.update(params).promise();
  return result;
};

export const deleteTable = ({ tableName = "users" }) => {
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
