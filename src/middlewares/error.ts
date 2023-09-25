import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_BAD_REQUEST } from "../consts";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`error ${error.message}`);
  const status = error.status || HTTP_STATUS_BAD_REQUEST;
  res.status(status).send({
    message: error.message,
  });
}
