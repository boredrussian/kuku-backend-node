import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import {
  getUserByAccessToken,
  getUserByLogin,
  updateUser_AccessToken,
  deleteTable,
  createTable,
} from "../../../dataBase/user/userDb";
import { verifyToken, makeToken } from "../../../lib/jwt";

export const getUserByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO add validation

  const { token } = req.body;
  //   deleteTable({});
  //   createTable({});

  try {
    const user = await getUserByAccessToken({ token });

    console.log("------------user----321-------", user);
    if (user) {
      const data = {
        address: user?.address,
        name: user?.login,
      };
      res.send(data);
    } else {
      return next(createError(404, "User is undefined [getUserByToken]"));
    }
  } catch (e) {
    console.warn("getUserByToken", e);
    return next(createError(404, "User is undefined [getUserByToken]"));
  }
};

// TODO getUserByLogin change return to get clear data
export const getUserRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO add validation
  let user;
  const { login, serverSessionProof } = req.body;
  //   deleteTable({});
  //   createTable({});
  try {
    user = await getUserByLogin({ login });
    console.log("user", user);
  } catch (e) {
    return next(createError(403, ""));
  }

  try {
    if (user?.serverSessionProof !== serverSessionProof) {
      // return next(createError(403, "Incorrect data"));
      console.log("serverSessionProof", serverSessionProof);
      console.log("user?.serverSessionProof", user?.serverSessionProof);
    }
    const accessToken = makeToken({ type: "access" });
    await updateUser_AccessToken({
      address: user?.address,
      accessToken: accessToken,
    });

    const data = {
      login: user?.login,
      address: user?.address,
      wif: user?.encryptedWif,
      token: accessToken,
    };
    res.send(data);
  } catch (e) {
    return next(createError(403, "Incorrect data"));
  }
};
