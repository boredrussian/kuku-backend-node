import { Request, Response, NextFunction } from "express";
import {
  getUserByAccessToken,
  deleteTable,
  createTable,
} from "../../../dataBase/user/userDb";
import { verifyToken, makeToken } from "../../../lib/jwt";

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO add validation

  const { token } = req.body;
  //   deleteTable({});
  //   createTable({});
  const user = await getUserByAccessToken({ token });
  const data = {
    address: user?.address,
    name: user?.login,
  };
  res.send(data);
};
