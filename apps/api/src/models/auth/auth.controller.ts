import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserResponseDto } from './dto/register-user-response.dto';
import { LoginUserResponseDto } from './dto/login-user-response.dto';
import { Cookies } from 'src/common/cookies/cookies.decorator';

import { RevalidateSessionResponseDto } from './dto/revalidate-session-response.dto';
import { LogoutUserResponseDto } from './dto/logout-user-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint to register a new user with email and password.',
  })
  @ApiOkResponse({
    description: 'User registered successfully',
    type: RegisterUserResponseDto,
  })
  async register(
    @Body() data: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    const user = await this.authService.register(data);
    return new RegisterUserResponseDto(user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login a user',
    description: 'Endpoint to login a user with email and password.',
  })
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginUserResponseDto,
  })
  async login(
    @Res({ passthrough: true }) response,
    @Body() data: LoginUserDto,
  ): Promise<LoginUserResponseDto> {
    const { user, accessToken, refreshToken } =
      await this.authService.login(data);

    response.cookie('refreshToken', refreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return new LoginUserResponseDto(user, accessToken);
  }

  @Post('revalidate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Revalidate user session',
    description:
      'Endpoint to revalidate user session using the refresh token stored in cookies.',
  })
  @ApiOkResponse({
    description: 'Session revalidated successfully',
    type: RevalidateSessionResponseDto,
  })
  async revalidate(
    @Res({ passthrough: true }) response,
    @Cookies('refreshToken') refreshToken: string,
  ): Promise<RevalidateSessionResponseDto> {
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.revalidate({
        refreshToken,
      });

    response.cookie('refreshToken', newRefreshToken.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return new RevalidateSessionResponseDto(accessToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Logout a user',
    description: 'Endpoint to logout a user and clear the refresh token.',
  })
  @ApiOkResponse({
    description: 'User logged out successfully',
    type: LogoutUserResponseDto,
  })
  async logout(
    @Res({ passthrough: true }) response,
    @Cookies('refreshToken') refreshToken: string,
  ): Promise<LogoutUserResponseDto> {
    await this.authService.logout({ refreshToken });

    response.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logged out successfully' };
  }
}
