import { Router } from "express";
import cors from "cors";
import parser from "body-parser";
import compression from "compression";
import express from "express";

const handleCors = (router: Router): void => {
  router.use(cors({ credentials: true, origin: true }));
};

const handleBodyRequestParsing = (router: Router): void => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json({ limit: "150kb" }));
};

const handleCompression = (router: Router): void => {
  router.use(compression());
};

const handleStatic = (router: Router): void => {
  /**
   *  console.log("__dirname", __dirname);
   *  console.log("process.cwd()", process.cwd());
   *  router.use("/static", express.static("public"));
   */
  router.use("/static", express.static(process.cwd() + "/public"));
};

export default [
  handleCors,
  handleBodyRequestParsing,
  handleCompression,
  handleStatic,
];
