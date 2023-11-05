import { NextFunction, Request, Response } from "express";
import { promises as fsp } from "fs";
import path from "path";
import { DB } from "../models/schemas";
import jwt from "jsonwebtoken";
import { JwtUserData } from "../global";
import { NotAuthenticatedError } from "../errors/NotAuthenticatedError";

export function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(req.url, req.url.startsWith("/login"));
  if (
    req.url === "/" ||
    req.url.startsWith("/login") ||
    req.url.startsWith("/register") ||
    req.url.startsWith("/favicon.ico")
  ) {
    return next();
  }

  const authHeaderParts = (
    req.headers.authorization || (req.headers.Authorization as string)
  )?.split(" ");

  const token = authHeaderParts?.[1];

  if (!authHeaderParts || authHeaderParts[0] !== "Bearer" || !token) {
    console.log("no auth header data");
    return next(new NotAuthenticatedError("Not authenticated"));
  }

  try {
    req.user = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtUserData;
  } catch (error) {
    console.error(error);
    return next(new NotAuthenticatedError("Not authenticated", error));
  }

  fsp
    .readFile(path.join(process.cwd(), "db", "db.json"))
    .then((contents) => {
      const stringData = contents.toString();
      const data = JSON.parse(stringData) as DB;

      const user =
        req.user?.username &&
        data.users.find((user) => req.user?.username === user.username);

      console.log(user);

      if (!user) return next(new NotAuthenticatedError("Not authenticated"));

      return next();
    })
    .catch((error) =>
      next(new NotAuthenticatedError("Not authenticated", error)),
    );
}
