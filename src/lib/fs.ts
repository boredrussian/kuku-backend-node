import * as fs from "fs";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";
import path from "path";
import fsp from "fs/promises";

const fsPath = process.cwd() + "/src/fileStorage";
// path.join(__dirname, "test______")

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
};

export const updateIndex = async (post: any) => {
  let book;
  try {
    book = parseJson(await fsp.readFile(`${fsPath}/book.json`, "utf8"));
    book.posts.push(post);
  } catch (e) {
    console.error("[jsonFsHandler][Error parsing JSON string:]", e);
  }

  try {
    await fsp.writeFile(`${fsPath}/book.json`, stringify(book));
  } catch (e) {
    console.error("[jsonFsHandler][Error parsing JSON string:]", e);
  }
};

export const readIndex = async () => {
  let data;
  try {
    data = parseJson(await fsp.readFile(`${fsPath}/book.json`, "utf8"));
  } catch (e) {
    console.error("[readIndex]", e);
  }
  return data;
};
