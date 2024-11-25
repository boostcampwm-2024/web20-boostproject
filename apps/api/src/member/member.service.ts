import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { MemberInfoResponseDto } from './dto/member-info-response.dto';
import { AttendanceResponseDto } from './dto/attendance-response.dto';
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

  async getMemberInfo(id: number): Promise<MemberInfoResponseDto> {
    const member = await this.findMemberById(id);
    if (!member) {
      throw new CustomException(ErrorStatus.MEMBER_NOT_FOUND);
    }
    return MemberInfoResponseDto.from(member);
  }

  async getMemberAttendance(memberId: number): Promise<AttendanceResponseDto> {
    const attendances = await this.attendanceRepository.find({
      where: { member: { id: memberId } },
      order: { startTime: 'DESC' },
    });
    return AttendanceResponseDto.of(memberId, attendances);
  }
}
