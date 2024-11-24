import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubAuthGuard } from './guard/github-auth.guard';
import { GithubAuthStrategy } from './strategy/github-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [PassportModule, MemberModule],
  controllers: [AuthController],
  providers: [AuthService, GithubAuthGuard, GithubAuthStrategy],
})
export class AuthModule {}
