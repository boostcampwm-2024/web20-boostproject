import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { Attendance } from 'src/attendance/attendance.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member) private readonly memberRepository: Repository<Member>,
    @InjectRepository(Attendance) private attendanceRepository: Repository<Attendance>,
  ) {}

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

  async getMemberAttendance(memberId: number): Promise<Attendance[]> {
    const attendances = await this.attendanceRepository.find({
      where: { member: { id: memberId } },
      order: { startTime: 'DESC' },
    });
    return attendances;
  }
}
