import { Request, Response, NextFunction } from "express";
import { register, isUniqLogin } from "./utilities/register";
import { getUser, getTokensPair } from "./utilities/getUser";

export default [
  {
    path: "/api/register",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        register(req, res, next);
        // res.send("OK");
      },
    ],
  },
  {
    path: "/api/isFreeLogin",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        isUniqLogin(req, res, next);
      },
    ],
  },
  {
    path: "/api/login",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        res.send("OK");
        register(req, res, next);
      },
    ],
  },
  {
    path: "/api/user-by-token",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        console.log("+++++++++++++++++ki++++++++++++++++++++++++++++++");

        getUser(req, res, next);
      },
    ],
  },
  {
    path: "/api/tokens-pair",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        getTokensPair(req, res, next);
      },
    ],
  },
];
