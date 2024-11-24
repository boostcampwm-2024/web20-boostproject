import { ConfigService } from '@nestjs/config';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { GithubAuthGuard } from './guard/github-auth.guard';
import { Request as Req } from 'express';

@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/signin/github')
  @UseGuards(GithubAuthGuard)
  signinGithub() {}

  @Get('/github/callback')
  @UseGuards(GithubAuthGuard)
  signinGithubCallback(@Request() req: Req) {
    const id = req.user;

    const payload = { id };

    console.log(payload);
  }
}
