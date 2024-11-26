import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';

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

  async createMember(member: Member) {
    return await this.memberRepository.save(member);
  }

  async updateMemberInfo(id: number, member: Member) {
    await this.memberRepository.update(id, member);
  }
}
