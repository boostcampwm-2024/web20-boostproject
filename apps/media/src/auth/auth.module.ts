import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JWTAuthStrategy } from './jwt-auth.strategy';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [PassportModule, MemberModule],
  providers: [JWTAuthStrategy],
})
export class AuthModule {}
