import * as fs from "fs";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";

export const jsonFsHandler = (post: any) => {
  const bookPath = process.cwd() + "/src/fileStorage/book.json";
  fs.readFile(bookPath, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }

    let book;
    try {
      book = parseJson(jsonString);
      book.posts.push(post);
    } catch (e) {
      console.log("[jsonFsHandler][Error parsing JSON string:]", err);
    }

    fs.writeFile(bookPath, stringify(book), (err) => {
      if (err) console.log("Error writing file:", err);
    });
  });
};
