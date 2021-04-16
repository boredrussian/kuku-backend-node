import { readIndex } from "../../../lib/fs";
import { Request, Response, NextFunction } from "express";

const getIndexPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentIndex = await readIndex();
  res.send(currentIndex);
};

export default getIndexPosts;
