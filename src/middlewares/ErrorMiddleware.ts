import { NextFunction, Request, Response } from "express";
import { NotAuthenticatedError } from "../errors/NotAuthenticatedError";
import { v4 } from "uuid";
import { BadRequestError } from "../errors/BadRequestError";

type ErrorResult = {
  id: string;
  type: string;
  message: string;
};

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(
    `Handling error for a ${req.xhr ? "n async" : "normal"} request to ${
      req.url
    }`,
  );

  const errorResult: ErrorResult = {
    id: v4(),
    type: "Error",
    message: error.message,
  };

  let status = 500;

  console.log("error middle", req, error.message);

  if (error instanceof NotAuthenticatedError) {
    status = 401;
    errorResult.id = error.id;
    errorResult.type = NotAuthenticatedError.type;
    errorResult.message = error.message;
  } else if (error instanceof BadRequestError) {
    status = 400;
    errorResult.id = error.id;
    errorResult.type = BadRequestError.type;
    errorResult.message = error.message;
  }

  console.log(
    `sending ${JSON.stringify(errorResult)} with status code ${status}`,
  );
  res.status(status).send(errorResult);
}
