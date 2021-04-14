import { Request, Response, NextFunction } from "express";
import savePost from "./utilities/savePost";

// import {validateBody} from '../../middleware/validate';

export default [
  {
    path: "/api/post",
    method: "get",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        res.send("ckram skram post!!!");
        
      },
    ],
  },
  {
    path: "/api/post",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): any => {
        savePost(req, res, next);
        res.send("OKK!!!");
      },
    ],
  },
];
