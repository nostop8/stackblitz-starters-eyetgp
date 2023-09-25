import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_UNAUTHORIZED } from "../consts";
import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  constructor(public message: string) {
    super(message, HTTP_STATUS_BAD_REQUEST);
  }
}
