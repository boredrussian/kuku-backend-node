import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { isPostValid } from "../../../lib/signature";
import { updateIndex, putFile } from "../../../lib/fs";

// import Logger from "../../../lib/logger";
// const logger = new Logger();

const savePost = async (req: Request, res: Response, next: NextFunction) => {
  // logger.info(`>>>>>> Come in savePost controller`);
  const { post, addToIndex } = req.body;
  console.log("addToIndex", addToIndex);
  let isValid;
  try {
    isValid = isPostValid(post);
    console.log("isValid", isValid);
  } catch (e) {
    isValid = false;
    return next();
  }
  if (isValid) {
    putFile(post);
    if (addToIndex) {
      updateIndex(post);
    }
  }

  // logger.info(`<<<<<< Come out savePost controller`);
};

export default savePost;
