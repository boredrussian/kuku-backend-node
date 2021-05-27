import { Request, Response, NextFunction } from "express";
import {
  //   createTable,
  createTable,
  putData,
  isFreeLogin,
  //   deleteTable,
} from "../../../dataBase/user/userDb";
import { makeToken } from "../../../lib/jwt";
import { access } from "node:fs";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   createTable({ tableName: "users", attributeName: "address" });
  //   deleteTable({ tableName: "users" });
  //   TODO: add validation
  const data = req.body;

  const accessToken = makeToken({ type: "access" });
  const refreshToken = makeToken({ type: "refresh" });

  try {
    await putData({
      tableName: "users",
      address: data.address,
      encryptedWif: data.encryptedWif,
      salt: data.salt,
      privateKey: data.privateKey,
      verifier: data.verifier,
      login: data.login,
      accessToken,
      refreshToken,
    });

    const resData = {
      refreshToken,
      accessToken,
      address: data.address,
      name: data.login,
      wif: data.wif,
    };

    res.send(resData);
  } catch (e) {
    console.warn("[register]", e);
  }
};

export const isUniqLogin = async (
  // TODO add validation
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const isLoginExist = await isFreeLogin({ login: data.login });
  res.send({ isFreeLogin: isLoginExist });
};
