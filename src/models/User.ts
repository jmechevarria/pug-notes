import { promises as fsp } from "fs";
import path from "path";
import { v4 } from "uuid";
import { DB } from "./schemas";
import { Note, NoteDTO } from "./Note";
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
  private notes: Note[];

  constructor(
    private username: string,
    private password: string
  ) {
    this.id = v4();
    this.notes = [];
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

  // async addNote(noteDto: NoteDTO) {
  //   const stringData = (
  //     await fsp.readFile(path.join(process.cwd(), "db", "db.json"))
  //   ).toString();

  //   const data = JSON.parse(stringData) as DB;

  //   const user = data.users.find((user) => this.id === user.id);

  //   if (!user || user.notes.find((note) => note.title === noteDto.title))
  //     throw new Error("Wrong data");

  //   const now = new Date();
  //   user.notes.push({
  //     id: noteDto.userId,
  //     title: noteDto.title,
  //     body: noteDto.body,
  //     dateCreated: now.toISOString(),
  //     favorite: noteDto.favorite,
  //   });

  //   await fsp.writeFile(
  //     path.join(process.cwd(), "db", "db.json"),
  //     JSON.stringify(data)
  //   );

  //   this.notes.push(
  //     new Note(
  //       noteDto.userId,
  //       noteDto.title,
  //       noteDto.body,
  //       now,
  //       noteDto.favorite,
  //       this
  //     )
  //   );
  // }
}
