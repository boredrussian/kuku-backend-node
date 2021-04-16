import { Request, Response, NextFunction } from "express";
import savePost from "./utilities/savePost";
import getIndexPosts from "./utilities/getPosts";

// import {validateBody} from '../../middleware/validate';

export default [
  {
    path: "/api/post",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        getIndexPosts(req, res, next);
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
