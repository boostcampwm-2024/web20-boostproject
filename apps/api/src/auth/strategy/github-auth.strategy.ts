import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SigninDto } from '../dto/signin.dto';

@Injectable()
export class GithubAuthStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private readonly configService: ConfigService) {
    super({
      clientID: configService.get('GH_CLIENT_ID'),
      clientSecret: configService.get('GH_SECRET'),
      callbackURL: configService.get('GH_CALLBACK'),
      scope: ['user:email'],
    });
  }

  validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { emails, username: name, photos, profileUrl } = profile;
    const signinDto = new SigninDto();
    signinDto.email = emails[0].value;
    signinDto.name = name;
    signinDto.profileImage = photos[0].value;
    signinDto.github = profileUrl;

    return this.authService.validateOrCreateMember(signinDto);
  }
}
