import { Request, Response, NextFunction } from "express";
import {
  getUserByAccessToken,
  deleteTable,
  createTable,
  updateTokensPair,
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
    login: user?.login,
    wif: user?.wif,
  };
  res.send(data);
};

export const getTokensPair = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO add validation
  const { token } = req.body;
  //   deleteTable({});
  // createTable({});

  if (!verifyToken({ token })) {
    // TODO:  add error code
    res.send("Token is invalid");
  }
  const accessToken = makeToken({ type: "access" });
  const refreshToken = makeToken({ type: "refresh" });

  try {
    updateTokensPair({
      oldRefreshToken: token,
      refreshToken,
      accessToken,
    });
  } catch (e) {}

  // 1.validate refresh token
  // 2.if ok create new pair
  // 3. save new tokens on dynamo
  // 4. send tokens pair

  /*  const user = await getUserByAccessToken({ token });
  const data = {
    address: user?.address,
    login: user?.login,
    wif: user?.wif,
  };
  res.send(data); */
};
