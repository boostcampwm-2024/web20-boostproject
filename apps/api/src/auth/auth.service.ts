import { JwtService } from '@nestjs/jwt';
import { MemberService } from './../member/member.service';
import { Injectable } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';

@Injectable()
export class AuthService {
  constructor(private readonly memberService: MemberService, private readonly jwtService: JwtService) {}

  async validateOrCreateMember({ email, profileImage, name, github }: SigninDto) {
    const member = await this.memberService.findMemberByEmail(email);

    if (!member) {
      return await this.memberService.createMember({ email, profileImage, name, github });
    }

    return member.id;
  }

  login(id: Express.User) {
    const payload = { id };
    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }

  async validateMember(id: number) {
    const member = await this.memberService.findMemberById(id);

    if (!member) {
      throw new CustomException(ErrorStatus.INVALID_TOKEN);
    }

    return member;
  }
}
