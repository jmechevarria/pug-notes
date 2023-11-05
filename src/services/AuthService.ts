import { promises as fsp } from "fs";
import path from "path";
import jwt from "jsonwebtoken";

import { DB } from "../models/schemas";
import { NotAuthenticatedError } from "../errors/NotAuthenticatedError";
import { UserResponse } from "../models/User";

export type LoginDTO = {
  username: string;
  password: string;
};

export type LoginResponse = UserResponse & {
  token: string;
};

export class AuthService {
  async login(loginDto: LoginDTO): Promise<LoginResponse> {
    const stringData = (
      await fsp.readFile(path.join(process.cwd(), "db", "db.json"))
    ).toString();

    const data = JSON.parse(stringData) as DB;

    const user = data.users?.find(
      (user) =>
        user.password === loginDto.password &&
        user.username === loginDto.username,
    );

    if (!user) throw new NotAuthenticatedError("Unauthorized");

    return {
      username: user.username,
      token: jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET as string,
      ),
    };
  }
}
