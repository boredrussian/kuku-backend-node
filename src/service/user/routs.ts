import { Request, Response, NextFunction } from "express";
import {
  register,
  isUniqLogin,
  getUserByToken,
  login,
  sessionProof,
  getUserRegister,
} from "./utilities";

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
        login(req, res, next);
      },
    ],
  },
  {
    path: "/api/login/session-proof",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        sessionProof(req, res, next);
      },
    ],
  },
  {
    path: "/api/user-by-token",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        getUserByToken(req, res, next);
      },
    ],
  },
  {
    path: "/api/user",
    method: "post",
    handler: [
      (req: Request, res: Response, next: NextFunction): void => {
        getUserRegister(req, res, next);
      },
    ],
  },
];
