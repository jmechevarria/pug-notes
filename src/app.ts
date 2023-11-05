/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import express, { NextFunction, Request, Response } from "express";
import userController from "./controllers/UserController";
import authController from "./controllers/AuthController";
import { errorHandler } from "./middlewares/ErrorMiddlware";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { BadRequestError } from "./errors/BadRequestError";

const app = express();

// set the folder from which our static resources (js, css, html) will be used
app.use(express.static(`${__dirname}/client`));

// set views folder (i.e: where we put our client-side resources)
app.set("views", `${__dirname}/client`);
app.set("view engine", "pug");

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(AuthMiddleware);

app.get("/", (req, res) => {
  console.log("GET /");
  res.render("index/index", { data: {} });
});

app.get("/register", (req: Request, res: Response) => {
  console.log("register:get");
  res.render("register/register");
});

app.post("/register", (req: Request, res: Response, next: NextFunction) => {
  console.log("register:post", req.body);

  if (!req.body?.username || !req.body?.password) {
    next(new BadRequestError("Missing data"));
  } else {
    userController
      .register({
        username: req.body.username,
        password: req.body.password,
      })
      .then((response) => {
        console.log("responsesss", response);
        res.send({ user: response });
      })
      .catch((error) => {
        next(error);
      });
  }
});

app.get("/login", (req: Request, res: Response) => {
  console.log("GET login");
  res.render("login/login");
});

app.post("/login", (req: Request, res: Response, next: NextFunction) => {
  if (!req.body?.username || !req.body?.password) {
    next(new BadRequestError("Missing data"));
  } else {
    console.log("controller");
    authController
      .login({
        username: req.body.username,
        password: req.body.password,
      })
      .then((response) => {
        console.log("OKssdfs", response);
        res.send({ user: response });
      })
      .catch((error) => {
        next(error);
      });
  }
});

app.use(errorHandler);

export default app;
