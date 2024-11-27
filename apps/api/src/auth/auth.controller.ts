import { AuthService } from './auth.service';
import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from './guard/github-auth.guard';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerTag } from 'src/common/constants/swagger-tag.enum';
import { ApiSuccessResponse } from 'src/common/decorators/success-res.decorator';
import { SuccessStatus } from 'src/common/responses/bases/successStatus';
import { SigninResponseDto } from './dto/signin-response.dto';
import { UserReq } from 'src/common/decorators/user-req.decorator';
import { Member } from 'src/member/member.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {}

  @Get('/signin/github')
  @UseGuards(GithubAuthGuard)
  @ApiTags(SwaggerTag.HEADER)
  @ApiSuccessResponse(SuccessStatus.OK(SigninResponseDto), SigninResponseDto)
  signinGithub() {}

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  signinGithubCallback(@UserReq() member: Member, @Res() res: Response) {
    const accessToken = this.authService.login(member);
    const CALLBACK_URI = this.configService.get('CALLBACK_URI');

    res.redirect(`${CALLBACK_URI}/auth?accessToken=${accessToken}`);
  }

  @Get('/signin/google')
  @UseGuards(GoogleAuthGuard)
  @ApiTags(SwaggerTag.HEADER)
  @ApiSuccessResponse(SuccessStatus.OK(SigninResponseDto), SigninResponseDto)
  signinGoogle() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  signinGoogleCallback(@UserReq() member: Member, @Res() res: Response) {
    const accessToken = this.authService.login(member);
    const CALLBACK_URI = this.configService.get('CALLBACK_URI');

    res.redirect(`${CALLBACK_URI}/auth?accessToken=${accessToken}`);
  }
}
