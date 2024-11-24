import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GG_CLIENT_ID'),
      clientSecret: configService.get('GG_SECRET'),
      callbackURL: configService.get('GG_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { displayName: name, emails, photos } = profile;
    const signinDto = {
      name,
      email: emails[0].value,
      profileImage: photos[0].value,
    };

    return this.authService.validateMember(signinDto);
  }
}
