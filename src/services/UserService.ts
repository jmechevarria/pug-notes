import { User, UserDTO, UserResponse } from "../models/User";
import jwt from "jsonwebtoken";

export type RegisterResponse = UserResponse & {
  token: string;
};

export class UserService {
  async register(userDto: UserDTO): Promise<RegisterResponse> {
    const user = new User(userDto.username, userDto.password);

    const result = await user.save();

    return {
      username: result.username,
      token: jwt.sign(
        { username: result.username },
        process.env.JWT_SECRET as string,
      ),
    };
  }
}
