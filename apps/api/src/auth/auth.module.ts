import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GithubAuthStrategy } from './strategy/github-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { MemberModule } from 'src/member/member.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTAuthStrategy } from './strategy/jwt-auth.strategy';
import { GoogleAuthStrategy } from './strategy/google-auth.startegy';

@Module({
  imports: [
    PassportModule,
    MemberModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '14d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GithubAuthStrategy, JWTAuthStrategy, GoogleAuthStrategy],
})
export class AuthModule {}
