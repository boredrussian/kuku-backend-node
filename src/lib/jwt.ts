import jwt from "jsonwebtoken";

/**
 * expiresIn: 86400, in milliseconds second - 24 hours
 *
 *
 *
 */

const expiredTimeMap = {
  access: 86400,
  refresh: 86400 * 30,
};

type EnumType = "access" | "refresh";
interface TypeType {
  type: EnumType;
}

export const makeToken = ({ type }: TypeType): string => {
  let jwtToken = "";

  try {
    jwtToken = jwt.sign({ type: type }, process.env.JWT_SECRET as string, {
      expiresIn: expiredTimeMap[type],
    });
  } catch (e) {
    console.log("[getToken]", e);
  }

  return jwtToken;
};

export const verifyToken = ({ token }: { token: string }) => {
  let isVerify = false;

  console.log("token____________4343________", token);
  console.log(
    "token____________ process.env.JWT_SECRET________",
    process.env.JWT_SECRET
  );

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decodedToken) {
      isVerify = true;
    }
  } catch (err) {
    console.log("[verifyToken]", err);
  }
  return isVerify;
};
