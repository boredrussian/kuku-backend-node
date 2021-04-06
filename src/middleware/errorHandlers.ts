import { Request, Response, NextFunction, Router } from "express";
import * as ErrorHandler from "../utils/ErrorHandler";

const handle404Error = (router: Router): void => {
  router.use((req: Request) => {
    console.log(req.url);
    console.log(req);
    console.log(req.url);
    ErrorHandler.notFoundError();
  });
};

const handleClientError = (router: Router): void => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.clientError(err, res, next);
  });
};

const handleServerError = (router: Router): void => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    ErrorHandler.serverError(err, res, next);
  });
};

// export default [handle404Error, handleClientError, handleServerError];
export default [handleClientError, handleServerError];
