import createError from "http-errors";
import { Request, Response, NextFunction } from "express";
import HttpStatus from "http-status-codes";
import { isPostValid } from "../../../lib/signature";
import { updateIndex, putFile } from "../../../lib/fs";
// import * as Busboy from "busboy";
import Busboy from "busboy";
import path from "path";
import * as fs from "fs";
// import Logger from "../../../lib/logger";
// const logger = new Logger();

const saveFiles = async (req: Request, res: Response, next: NextFunction) => {
  console.log("req.body", req.body);
  const fsPath = process.cwd() + "/src/fileStorage/imgStorage";
  const busboy = new Busboy({ headers: req.headers });
  // const { post, addToIndex } = req.body;
  busboy.on(
    "file",
    function (
      fieldname: any,
      file: any,
      filename: any,
      encoding: any,
      mimetype: any
    ) {
      const saveTo = path.join(fsPath, filename);
      const stream = fs.createWriteStream(saveTo);
      file.pipe(stream);
      // stream.on("close", () => {
      //   console.log(`Upload of '${filename}' finished`);
      //   res.redirect("back");
      // });
    }
  );

  busboy.on("finish", function () {
    res.writeHead(200, { Connection: "close" });
    res.end("That's all folks!");
  });

  return req.pipe(busboy);
};

export default saveFiles;
