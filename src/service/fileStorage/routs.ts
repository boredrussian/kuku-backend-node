import { Request, Response, NextFunction } from "express";
import savePost from "./utilities/savePost";
import getBook from "./utilities/getBook";

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
];
