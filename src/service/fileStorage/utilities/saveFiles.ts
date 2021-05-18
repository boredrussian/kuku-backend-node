import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { isPostValid } from "../../../lib/signature";
import { updateIndex, putFile } from "../../../lib/fs";
// import * as Busboy from "busboy";
import Busboy from "busboy";
import path from "path";
import * as fs from "fs";
import CryptoJS from "crypto-js";
import bs58 from "bs58";
import fsp from "fs/promises";
import { createHash } from "crypto";
// import Logger from "../../../lib/logger";
// const logger = new Logger();
import { nanoid } from "nanoid";
import mime from "mime";
import { putObjectS3 } from "../../../lib/fsAWS";
// import AWS from "aws-sdk";

// const s3 = new AWS.S3();

export const getHash = (data: any) => {
  const postJson = "string";
  let resHash;
  try {
    const hash = CryptoJS.SHA256(postJson);
    const hashString = hash.toString(CryptoJS.enc.Hex);
    const bytes = Buffer.from(hashString, "hex");
    resHash = bs58.encode(bytes);
  } catch (e) {
    console.error("[getHash]", e);
  }
  return resHash;
};

/**
 *   way to calculate chunks use node lib crypto
 *   import { createHash } from "crypto";
 *   const getHash = createHash("sha256");
 *   getHash.update(data.toString("base64"));
 *   file.on("data", function (data: any) { getHash.update(data);}
 *   const hashFinCripto = getHash.copy().digest("hex");
 *
 *  or gather chunks in one array
 *  binaryArr.push(data);
 *  file.on("data", function (data: any) {
 *  const buf = Buffer.concat(binaryArr);
 *  const hash = CryptoJS.SHA256(buf.toString("base64")); }
 *  const hashString = hash.toString(CryptoJS.enc.Base64);
 *
 */

const saveFiles = async (req: Request, res: Response, next: NextFunction) => {
  const fsPath = process.cwd() + "/public";
  const tempFileNameHash = nanoid();
  const busboy = new Busboy({ headers: req.headers });

  const sha256 = CryptoJS.algo.SHA256.create();

  let hash_58: string;

  busboy.on(
    "file",
    function (
      fieldname: any,
      file: any,
      filename: any,
      encoding: any,
      mimetype: any
    ) {
      // mime.getType("txt"); // ⇨ 'text/plain'
      const fileExtension = mime.getExtension(mimetype);
      const tempFileName = `${tempFileNameHash}.${fileExtension}`;
      const saveTo = path.join(fsPath, tempFileName);
      file.on("data", function (data: any) {
        sha256.update(data.toString("base64"));
      });

      file.on("end", async function () {
        const hashFin = sha256.finalize();
        const hashString = hashFin.toString(CryptoJS.enc.Hex);
        const bytes = Buffer.from(hashString, "hex");
        hash_58 = bs58.encode(bytes);
        const hashFileName = `${hash_58}.${fileExtension}`;

        try {
          await fsp.rename(
            path.join(fsPath, tempFileName),
            path.join(fsPath, hashFileName)
          );
        } catch (e) {
          console.warn("rename files", e);
        }

        try {
          const data = await fsp.readFile(path.join(fsPath, hashFileName));
          const saveToPath = `${process.env.AWS_PATH_PUT_IMG}/${hashFileName}`;
          putObjectS3({
            key: saveToPath,
            data,
            type: mimetype,
          });
        } catch (e) {
          console.error("[readIndex]", e);
        }
      });

      const stream = fs.createWriteStream(saveTo);
      file.pipe(stream);

      stream.on("close", () => {
        const resData = {
          hash: hash_58,
          type: mimetype,
        };
        res.send(resData);
      });
    }
  );

  // busboy.on("finish", function () {
  //   // res.send(hash_58);
  //   // res.writeHead(200, { Connection: "close" });
  // });

  return req.pipe(busboy);
};

export default saveFiles;
