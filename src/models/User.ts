import { promises as fsp } from "fs";
import path from "path";
import { v4 } from "uuid";
import { DB } from "./schemas";
import { BadRequestError } from "../errors/BadRequestError";

export type UserDTO = {
  username: string;
  password: string;
};

export type UserResponse = {
  username: string;
};

export class User {
  private id: string;

  constructor(
    private username: string,
    private password: string
  ) {
    this.id = v4();
  }

  async save(): Promise<UserResponse> {
    const stringData = (
      await fsp.readFile(path.join(process.cwd(), "db", "db.json"))
    ).toString();
    const data = JSON.parse(stringData) as DB;

    if (!data.users) data.users = [];

    if (
      data.users.find(
        (user) => user.id === this.id || user.username === this.username
      )
    )
      throw new BadRequestError("Duplicate username");

    data.users.push({
      id: this.id,
      username: this.username,
      password: this.password,
      notes: [],
    });

    await fsp.writeFile(
      path.join(process.cwd(), "db", "db.json"),
      JSON.stringify(data)
    );

    return { username: this.username };
  }
}
