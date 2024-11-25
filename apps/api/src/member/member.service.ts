import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { SigninDto } from 'src/auth/dto/signin.dto';

@Injectable()
export class MemberService {
  constructor(@InjectRepository(Member) private readonly memberRepository: Repository<Member>) {}

  async findMemberByEmail(email: string) {
    const member = await this.memberRepository
      .createQueryBuilder('member')
      .where('member.email = :email', { email })
      .getOne();

    return member;
  }

  async findMemberById(id: number) {
    const member = await this.memberRepository.createQueryBuilder('member').where('member.id = :id', { id }).getOne();

    return member;
  }

  async createMember({ email, profileImage, name, github }: SigninDto) {
    const member = this.memberRepository.create([{ email, name, profileImage, github }]);
    const [savedMember] = await this.memberRepository.save(member);

    return savedMember.id;
  }
}
