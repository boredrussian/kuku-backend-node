import * as fs from "fs";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";
import path from "path";
import fsp from "fs/promises";
import { putObjectS3 } from "./fsAWS";
import AWS from "aws-sdk";
import {
  createTable,
  deleteTable,
  updateIndexDb,
  getIndex,
  putData,
} from "./dbAWS";

// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// AWS.config.update({
//   region: "us-west-2",
// });

// const dynamoDb = new AWS.DynamoDB.DocumentClient();
// const dynamoDbCreate = new AWS.DynamoDB();

const fsPath = process.cwd() + "/src/fileStorage/books";
const fsPathIndex = process.cwd() + "/src/fileStorage";

const getFoldersName = (hash: string) => {
  return {
    first: hash.slice(0, 2),
    second: hash.slice(2, 4),
  };
};

export const putFile = async (post: any) => {
  const hash = post.hash;
  const folders = getFoldersName(hash);

  try {
    await fsp.mkdir(`${fsPath}/${folders.first}/${folders.second}`, {
      recursive: true,
    });
  } catch (e) {
    console.error("[putFile][mkdir][Error create dir:]", e);
  }

  try {
    await fsp.writeFile(
      `${fsPath}/${folders.first}/${folders.second}/${hash}.json`,
      stringify(post)
    );
  } catch (e) {
    console.error("[putFile][Error writeFile:]", e);
  }

  try {
    const data: any = await fsp.readFile(
      `${fsPath}/${folders.first}/${folders.second}/${hash}.json`,
      "utf8"
    );
    const saveToPath = `${process.env.AWS_PATH_PUT_POST_OBJECT}/${folders.first}/${folders.second}/${hash}.json`;
    putObjectS3({
      key: saveToPath,
      data,
      type: "application/json",
    });
  } catch (e) {
    console.error("[readIndex]", e);
  }
};

export const updateIndex = async (post: any) => {
  let book;
  try {
    book = parseJson(await fsp.readFile(`${fsPathIndex}/book.json`, "utf8"));
    book.posts.push(post);

    // createTable({});
    // deleteTable({});

    /*     await putData({
      data: { posts: [] },
      address: "testHash",
      version: 0,
    }); */

    // const data = await getIndex({ address: "testHash" });
    const data = await updateIndexDb({ data: post, address: "testHash" });

    // console.log(
    //   "_____________________-----------------------______________getIndex",
    //   data
    // );

    // await dynamoDb.put(params).promise();
  } catch (e) {
    console.error("[jsonFsHandler][Error parsing JSON string:]", e);
  }

  try {
    await fsp.writeFile(`${fsPathIndex}/book.json`, stringify(book));
  } catch (e) {
    console.error("[jsonFsHandler][Error parsing JSON string:]", e);
  }
};

export const readIndex = async () => {
  let data;
  try {
    data = parseJson(await fsp.readFile(`${fsPathIndex}/book.json`, "utf8"));
  } catch (e) {
    console.error("[readIndex]", e);
  }
  return data;
};
