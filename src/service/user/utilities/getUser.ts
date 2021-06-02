import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import {
  getUserByAccessToken,
  getUserByLogin,
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
    const data = {
      address: user?.address,
      name: user?.login,
    };
    res.send(data);
  } catch (e) {
    console.warn("getUserByToken", e);
    return next(createError(404, "User is undefined [getUserByToken]"));
  }
};

// TODO getUserByLogin change return to get clear data
/* export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO add validation
  let user;
  const { login, proof } = req.body;
  //   deleteTable({});
  //   createTable({});
  try {
    const userData = await getUserByLogin({ login });
    if (userData.Items && userData.Items.length > 0) {
      user = userData.Items[0];
    }
  } catch (e) {
    return next(createError(403, ""));
  }

  try {
    if (!user?.serverSessionProof === proof) {
      return next(createError(403, "Incorrect data"));
    }

    const data = {
      login: user?.login,
      address: user?.login,
      wif: user?.encryptedWif,
    };
    res.send(data);
  } catch (e) {}

  // return next(createError(403, " parametre id is nessesary"));
};
 */
