import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JWTAuthStrategy } from './jwt-auth.strategy';

@Module({
  imports: [PassportModule],
  providers: [JWTAuthStrategy],
})
export class AuthModule {}
