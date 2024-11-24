import { AuthService } from './auth.service';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from './guard/github-auth.guard';
import { Request as Req } from 'express';
import { GoogleAuthGuard } from './guard/google-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerTag } from 'src/common/constants/swagger-tag.enum';
import { ApiSuccessResponse } from 'src/common/decorators/success-res.decorator';
import { SuccessStatus } from 'src/common/responses/bases/successStatus';
import { SigninResponseDto } from './dto/signin-response.dto';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/signin/github')
  @UseGuards(GithubAuthGuard)
  @ApiTags(SwaggerTag.HEADER)
  @ApiSuccessResponse(SuccessStatus.OK(SigninResponseDto), SigninResponseDto)
  signinGithub() {}

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  signinGithubCallback(@Request() req: Req) {
    const id = req.user;

    const accessToken = this.authService.login(id);

    return {
      accessToken,
    };
  }

  @Get('/signin/google')
  @UseGuards(GoogleAuthGuard)
  @ApiTags(SwaggerTag.HEADER)
  @ApiSuccessResponse(SuccessStatus.OK(SigninResponseDto), SigninResponseDto)
  signinGoogle() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  signinGoogleCallback(@Request() req: Req) {
    const id = req.user;

    const accessToken = this.authService.login(id);

    return {
      accessToken,
    };
  }
}
