import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import tokenConstants from './token.constants';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: tokenConstants().secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [TokenService],
})
export class TokenModule {}
