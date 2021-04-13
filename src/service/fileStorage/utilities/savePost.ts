import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { isPostValid } from "../../../lib/signValidate";
import * as fs from "fs";
import stringify from "fast-json-stable-stringify";
import parseJson from "parse-json";
// import Logger from "../../../lib/logger";
// const logger = new Logger();

const writeFile = (post: any) => {
  const filePash = "../../../fileStorage/book.json";
  const bookPath = process.cwd() + "/src/fileStorage/book.json";

  fs.readFile(bookPath, "utf8", (err, jsonString) => {
    if (err) {
      console.log("File read failed:", err);
      return;
    }

    let book;
    try {
      book = parseJson(jsonString);
      console.log("posts is:", book.posts);
      book.posts.push(post);
      console.log("book.posts", book.posts);
    } catch (err) {
      console.log("[writeFile][Error parsing JSON string:]", err);
    }

    try {
      fs.writeFile(bookPath, JSON.stringify(book), (err) => {
        if (err) console.log("Error writing file:", err);
      });
    } catch (e) {}
  });
};

const savePost = async (req: Request, res: Response, next: NextFunction) => {
  // logger.info(`>>>>>> Come in savePost controller`);
  const { post } = req.body;
  let isValid;
  try {
    isValid = isPostValid(post);
    console.log("isValid", isValid);
  } catch (e) {
    isValid = false;
    return next();
  }
  if (isValid) {
    writeFile(post);
  }

  // logger.info(`<<<<<< Come out savePost controller`);
};

export default savePost;
