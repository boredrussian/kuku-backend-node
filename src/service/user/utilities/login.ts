import { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import {
  getUserByLogin,
  createTable,
  deleteTable,
  updateUser_AddEphemeralSecret,
  updateUser_ServerSessionProof,
} from "../../../dataBase/user/userDb";
import srp from "secure-remote-password/server";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //   deleteTable({});
  //   createTable({});
  if (!req.body.login) {
    res.send("Data is invalid!");
  }
  let serverEphemeralSecret, user;
  try {
    user = await getUserByLogin({ login: req.body.login });
    if (!user) {
      return;
    }
  } catch (e) {
    console.warn("[login--1]", e);
    return next(createError(404, "Login or password is invalid"));
  }

  try {
    const serverEphemeral = srp.generateEphemeral(user?.verifier);
    serverEphemeralSecret = serverEphemeral.secret;
    const loginDataSecondStep = {
      serverPublicEphemeral: serverEphemeral.public,
      salt: user.salt,
    };
    res.send(loginDataSecondStep);
  } catch (e) {
    console.warn("[login--2]", e);
    return next(createError(403, "SRP error generate serverEphemeral"));
  }

  try {
    const resUpdate = updateUser_AddEphemeralSecret({
      address: user?.address,
      serverEphemeralSecret: serverEphemeralSecret as string,
    });
  } catch (e) {
    console.warn("[login--3]", e);
    return next(createError(403, "SRP error add ephemeral secret"));
  }
};

export const sessionProof = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: validation
  //   STORE uniq user login on dynamodb if possible
  let user;
  try {
    user = await getUserByLogin({ login: req.body.login });
  } catch (e) {}
  const clientSessionProof = req.body.clientSessionProof;
  const clientEphemeralPublic = req.body.clientEphemeralPublic;
  const login = req.body.login;
  const serverEphemeralSecret = user?.serverEphemeralSecret;
  const salt = user?.salt;
  const verifier = user?.verifier;

  if (user) {
    try {
      const serverSession = srp.deriveSession(
        serverEphemeralSecret,
        clientEphemeralPublic,
        salt,
        login,
        verifier,
        clientSessionProof
      );
      await updateUser_ServerSessionProof({
        address: user.address,
        serverSessionProof: serverSession.proof,
      });
      res.send({ serverSessionProof: serverSession.proof });
    } catch (e) {
      console.warn("[sessionProof]", e);
      res.send({ errorMessage: "Login or password is invalid" });
    }
  }
};

/* 
  console.log("serverEphemeralSecret", serverEphemeralSecret);
  console.log("clientEphemeralPublic", clientEphemeralPublic);
  console.log("salt", salt);
  console.log("login", login);
  console.log("verifier", verifier);
  console.log("clientSessionProof", clientSessionProof); */
