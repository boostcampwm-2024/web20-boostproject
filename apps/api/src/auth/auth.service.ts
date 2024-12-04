import { JwtService } from '@nestjs/jwt';
import { MemberService } from './../member/member.service';
import { Injectable } from '@nestjs/common';
import { SigninDto } from './dto/signin.dto';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { Member } from 'src/member/member.entity';
import { FieldEnum } from '../member/enum/field.enum';

@Injectable()
export class AuthService {
  GUEST_ID = 1;
  constructor(private readonly memberService: MemberService, private readonly jwtService: JwtService) {}

  async validateOrCreateMember(signinDto: SigninDto) {
    const member = await this.memberService.findMemberByEmail(signinDto.email);

    if (!member) {
      return await this.memberService.createMember(signinDto.toMember());
    }

    return member;
  }

  login(member: Member) {
    const payload = { id: member.id, camperId: member.camperId };
    const accessToken = this.jwtService.sign(payload);
    const isNecessaryInfo = Boolean(member.field && member.name && member.camperId);

    return { accessToken, isNecessaryInfo };
  }

  async validateMember(id: number) {
    const member = await this.memberService.findMemberById(id);

    if (!member) {
      throw new CustomException(ErrorStatus.INVALID_TOKEN);
    }

    return member;
  }

  async createGuest() {
    const member = new Member();
    member.camperId = `guest${this.GUEST_ID}`;
    member.name = `guest${this.GUEST_ID}`;
    member.field = FieldEnum.WEB;
    const newMember = await this.memberService.createMember(member);
    const payload = { id: newMember.id, camperId: newMember.camperId };
    console.log(payload);
    return this.jwtService.sign(payload);
  }
}
