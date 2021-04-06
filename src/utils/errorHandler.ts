import { Response, NextFunction } from "express";
import { HTTPClientError, HTTP404Error, HTTP400Error } from "./httpErrors";
import Logger from "../lib/logger";

const logger = new Logger();

export const notFoundError = (): void => {
    throw new HTTP404Error("Method not found.");
};

export const hooksError = (): void => {
  throw new HTTP400Error("Bad Hooks request");
};

export const tasksError = (): void => {
  throw new HTTP400Error("Missing query parameter");
};

export const clientError = (err: Error, res: Response, next: NextFunction) => {
  if (err instanceof HTTPClientError) {
    logger.warn("Error: ", err);
    res.status(err.statusCode).send(err.message);
  } else {
    next(err);
  }
};

export const serverError = (
  err: Error,
  res: Response,
  next: NextFunction
): void => {
  logger.warn("Error: ", err);
  res.status(500).send(err.stack);
  if (process.env.NODE_ENV === "production") {
    res.status(500).send("Internal Server Error");
  } else {
    res.status(500).send(err.stack);
  }
};
