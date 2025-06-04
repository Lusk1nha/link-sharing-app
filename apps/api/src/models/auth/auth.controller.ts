import { Body, Controller, Post, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import {
  LoginPayloadDto,
  LoginResponseDto,
  RegisterPayloadDto,
  RegisterResponseDto,
} from "./dto/auth.dto";
import { EmailFactory } from "src/common/entities/email/email.factory";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller("auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({
    summary: "Register user",
    description: "Create a new user with email and password",
  })
  async register(
    @Body() body: RegisterPayloadDto,
  ): Promise<RegisterResponseDto> {
    const email = EmailFactory.from(body.email);
    const password = body.password;

    const user = await this.authService.signUp(email, password);

    return {
      user,
    };
  }

  @Post("login")
  @ApiOperation({
    summary: "Login user",
    description: "Authenticate user with email and password",
  })
  async login(
    @Res({ passthrough: true }) response,
    @Body() body: LoginPayloadDto,
  ): Promise<LoginResponseDto> {
    const email = EmailFactory.from(body.email);
    const password = body.password;

    const { accessToken, refreshToken } = await this.authService.signIn(
      email,
      password,
    );

    response.cookie("refreshToken", refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return {
      accessToken,
    };
  }
}
