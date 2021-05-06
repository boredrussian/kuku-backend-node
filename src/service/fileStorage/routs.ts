import { Request, Response, NextFunction } from "express";
import savePost from "./utilities/savePost";
import getBook from "./utilities/getBook";
import saveFiles from "./utilities/saveFiles";

// import {validateBody} from '../../middleware/validate';

export default [
  {
    path: "/api/book",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        getBook(req, res, next);
      },
    ],
  },
  {
    path: "/api/post",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        savePost(req, res, next);
        res.send("OK");
      },
    ],
  },
  {
    path: "/api/files/upload",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        saveFiles(req, res, next);
        // res.send("OK");
      },
    ],
  },
];
