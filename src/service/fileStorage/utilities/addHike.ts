import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";

import Logger from "../../../lib/logger";
// const logger = new Logger();

const _addHikeToHikeDoc = async (hike: any) => {
  try {
  } catch {
    return createError(403, "createHike failure");
  }
};

const addHike = async (req: Request, res: Response, next: NextFunction) => {
  //   logger.info(`>>>>>> Come in addHike controller`);
  const { hike } = req.body;
  let newHike;
  try {
    console.log("newHike");
    console.log(newHike);
  } catch {
    return next(newHike);
  }
  //   logger.info(`<<<<<< Come out addHike controller`);
};

export default addHike;
