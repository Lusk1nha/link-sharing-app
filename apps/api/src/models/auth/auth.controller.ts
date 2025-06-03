import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginPayloadDto, RegisterPayloadDto } from "./dto/auth.dto";
import { EmailFactory } from "src/common/entities/email/email.factory";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() body: RegisterPayloadDto) {
    const email = EmailFactory.from(body.email);
    const password = body.password;

    await this.authService.signUp(email, password);

    return {
      message: "User registered successfully",
    };
  }

  @Post("login")
  async login(@Body() body: LoginPayloadDto) {
    const email = EmailFactory.from(body.email);
    const password = body.password;

    const { user } = await this.authService.signIn(email, password);

    return {
      message: "User logged in successfully",
      user,
    };
  }
}
