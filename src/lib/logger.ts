/* eslint-disable @typescript-eslint/no-explicit-any */
import { Format, TransformableInfo } from "logform";
import * as path from "path";
import * as winston from "winston";
import DailyRotateFile = require("winston-daily-rotate-file");
import * as Transport from "winston-transport";
import dotenv from "dotenv";

dotenv.config();

type LogLevel = "error" | "info" | "warn" | "debug";

export default class Logger {
  private static buildLogger({
    parseArgs = true,
    logInConsole = true,
  }: {
    parseArgs?: boolean;
    logInConsole?: boolean;
  }): winston.Logger {
    const logPath = path.join(__dirname, "..", "..", "logs");
    const errorTransport = Logger.getErrorTransport(logPath);
    const infoTransport = Logger.getInfoTransport(logPath);
    const debugTransport = Logger.getDebugTransport(logPath);
    const warnTransport = Logger.getWarnTransport(logPath);

    const transports = [
      errorTransport,
      warnTransport,
      infoTransport,
      debugTransport,
    ];
    if (logInConsole) {
      transports.push(Logger.getConsoleTransport("debug"));
    }

    return winston.createLogger({
      format: Logger.getFormat(parseArgs),
      transports,
    });
  }

  private static assembleLogOutput(
    parseArgs: boolean,
    info: TransformableInfo
  ): string {
    const { timestamp, level, message, ...args } = info;

    const ts = timestamp.slice(0, 19).replace("T", " ");
    // print out a special prefix when in test mode
    const testPrefix =
      process.env.JEST_WORKER_ID === undefined ? "" : "TEST-MODE";

    return `${testPrefix} [${level}] @ ${ts}: ${message} ${
      parseArgs
        ? Object.keys(args).length
          ? JSON.stringify(args, null, 2)
          : ""
        : ""
    }`;
  }

  private static getFormat(parseArgs = true): Format {
    return winston.format.combine(
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf((info: TransformableInfo) => {
        return Logger.assembleLogOutput(parseArgs, info);
      })
    );
  }

  private static getDebugTransport(logPath: string): Transport {
    return Logger.getFileTransport(logPath, "debug");
  }

  private static getInfoTransport(logPath: string): Transport {
    return Logger.getFileTransport(logPath, "info");
  }

  private static getWarnTransport(logPath: string): Transport {
    return Logger.getFileTransport(logPath, "warn");
  }

  private static getErrorTransport(logPath: string): Transport {
    return Logger.getFileTransport(logPath, "error");
  }

  private static getFileTransport(
    logPath: string,
    level: string,
    config = {
      datePattern: "DD-MM-YYYY",
      maxFiles: "90d",
      maxSize: "20m",
      zippedArchive: true,
    }
  ): DailyRotateFile {
    return new DailyRotateFile(
      Object.assign(
        {
          filename: path.join(logPath, level, `${level}-%DATE%.log`),
          level,
        },
        config
      )
    );
  }

  private static getConsoleTransport(
    level: LogLevel
  ): winston.transports.ConsoleTransportInstance {
    return new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true })),
      level,
    });
  }

  private winston: winston.Logger;

  constructor() {
    this.winston = Logger.buildLogger({});
  }

  public error(message: string, ...args: any[]): void {
    this.winston.error(message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.winston.warn(message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.winston.info(message, ...args);
  }

  public debug(message: string, ...args: any[]): void {
    this.winston.debug(message, ...args);
  }

  public log(level: LogLevel, message: string): void {
    this.winston.log({ level, message });
  }
}
