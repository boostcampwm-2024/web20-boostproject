import { Module } from '@nestjs/common';
import { JWTAuthStrategy } from './jwt-auth.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  providers: [JWTAuthStrategy],
  exports: [JWTAuthStrategy],
})
export class AuthModule {}
