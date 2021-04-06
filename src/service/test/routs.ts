import { Request, Response, NextFunction } from "express";
import { validateBody } from "../../middleware/validate";

export default [
  {
    path: "/api/test/post",
    method: "post",
    handler: [
      // validateBody(['userId']),
      (req: Request, res: Response, next: NextFunction): void => {
        res.send("ckram skram!!!");
      },
    ],
  },
  {
    path: "/api/test/get",
    method: "get",
    handler: [
      // validateBody(['userId']),
      () => console.log("234"),
      (req: Request, res: Response, next: NextFunction): void => {
        res.send("ckram skram!!!");
      },
    ],
  },
];
