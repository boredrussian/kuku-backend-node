import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { isPostValid } from "../../../lib/signature";
import { jsonFsHandler } from "../../../lib/fs";

// import Logger from "../../../lib/logger";
// const logger = new Logger();

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
    jsonFsHandler(post);
  }

  // logger.info(`<<<<<< Come out savePost controller`);
};

export default savePost;
