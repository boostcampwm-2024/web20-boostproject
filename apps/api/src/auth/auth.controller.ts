import { AuthService } from './auth.service';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from './guard/github-auth.guard';
import { Request as Req } from 'express';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/signin/github')
  @UseGuards(GithubAuthGuard)
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
}
