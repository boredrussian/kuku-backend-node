import { Request, Response, NextFunction } from "express";
import register from "./utilities/register";

export default [
  {
    path: "/api/register",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        register(req, res, next);
      },
    ],
  },
  {
    path: "/api/login",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        res.send("OK");
      },
    ],
  },
];
