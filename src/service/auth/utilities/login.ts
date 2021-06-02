import { Request, Response, NextFunction } from "express";
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
  let user, serverEphemeralSecret;

  const userRes = await getUserByLogin({ login: req.body.login });

  if (userRes.Items && userRes.Items.length > 0) {
    user = userRes.Items[0];
    const serverEphemeral = srp.generateEphemeral(user.verifier);
    serverEphemeralSecret = serverEphemeral.secret;
    const loginDataSecondStep = {
      serverPublicEphemeral: serverEphemeral.public,
      salt: user.salt,
    };
    res.send(loginDataSecondStep);
  } else {
    res.send({ errorMessage: "Login or password is invalid" });
  }

  const data = {};
  try {
    const resUpdate = updateUser_AddEphemeralSecret({
      address: user?.address,
      serverEphemeralSecret: serverEphemeralSecret as string,
    });
  } catch (e) {
    console.warn("[login]", e);
  }
};

export const sessionProof = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO: validation
  //   STORE uniq user login on dynamodb if possible
  const userData = await getUserByLogin({ login: req.body.login });
  let user;
  if (userData.Items && userData.Items?.length > 0) {
    user = userData.Items[0];
  }
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
