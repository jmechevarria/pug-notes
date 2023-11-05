import { UserDTO } from "../models/User";
import { RegisterResponse, UserService } from "../services/UserService";

class UserController {
  constructor(private readonly userService: UserService) {}

  async register(user: UserDTO): Promise<RegisterResponse> {
    const result = await this.userService.register(user);

    return result;
  }
}

export default new UserController(new UserService());
