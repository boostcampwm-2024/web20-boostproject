import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MemberService } from '../member/member.service';

@Injectable()
export class JWTAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService, private readonly memberService: MemberService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request) {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer 토큰 형태이므로 'Bearer ' 제거
    return this.memberService.findMemberById(token);
  }
}
