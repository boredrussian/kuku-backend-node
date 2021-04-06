import { Request, Response, NextFunction } from "express";
import addHike from "./utilities/addHike";

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
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        await addHike(req, res, next);
      },
    ],
  },
];
