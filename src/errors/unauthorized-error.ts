import { HTTP_STATUS_UNAUTHORIZED } from "../consts";
import { HttpError } from "./http-error";

export class UnauthorizedHttpError extends HttpError {
  constructor(public message: string) {
    super(message, HTTP_STATUS_UNAUTHORIZED);
  }
}
