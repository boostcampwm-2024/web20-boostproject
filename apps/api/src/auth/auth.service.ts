import { MemberService } from './../member/member.service';
import { Injectable } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(private readonly memberService: MemberService) {}

  async validateMember({ email, profileImage, name, github }: SigninDto) {
    const { id } = await this.memberService.findMemberByEmail(email);

    if (!id) {
      return await this.memberService.createMember({ email, profileImage, name, github });
    }

    return id;
  }
}
