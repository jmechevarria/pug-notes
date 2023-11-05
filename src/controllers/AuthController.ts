import { UserDTO, UserResponse } from "../models/User";
import { AuthService, LoginResponse } from "../services/AuthService";

class AuthController {
  constructor(private readonly authService: AuthService) {}

  async login(user: UserDTO): Promise<LoginResponse> {
    const result = await this.authService.login(user);

    return result;
  }
}

export default new AuthController(new AuthService());
