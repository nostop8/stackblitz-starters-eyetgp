import { NextFunction, Response } from "express";
import { RequestWithUser } from "../types";
import jwt from "jsonwebtoken";
import { UnauthorizedHttpError } from "../errors/unauthorized-error";

export function authorizeMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers as unknown as {
    authorization: string;
  };
  const token = authorization?.split(" ")?.[1];

  if (!token) {
    throw new UnauthorizedHttpError("No token provided");
  }

  try {
    // Note: this does not have secret verification. This is just for test.
    const { id } = jwt.decode(token) as { id: number };
    req.userId = id;
    next();
  } catch (error) {
    throw new UnauthorizedHttpError("JWT decode failed");
  }
}
