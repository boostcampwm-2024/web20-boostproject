import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { Member } from '../member/member.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  /**
   * 방송 종료 시 출석 기록을 생성합니다.
   * @param memberId 사용자 ID
   * @param startTime 방송 시작 시간
   * @param endTime 방송 종료 시간
   * @returns 생성된 출석 정보
   */
  async createAttendanceRecord(member: Member, startTime: Date): Promise<Attendance> {
    const endTime = new Date();
    const isValidStartTime = this.isValidStartTime(startTime);
    const isValidEndTime = this.isValidEndTime(endTime);

    const attendance = this.attendanceRepository.create({
      date: new Date(),
      attended: isValidStartTime && isValidEndTime,
      startTime,
      endTime,
      member,
    });

    return await this.attendanceRepository.save(attendance);
  }

  // 9시 30분 ~ 10시 사이 === true
  private isValidStartTime(startTime: Date): boolean {
    const hour = startTime.getHours();
    const minutes = startTime.getMinutes();
    return (hour === 9 && minutes >= 30) || (hour === 10 && minutes === 0);
  }

  // 19시 이후 === true
  private isValidEndTime(endTime: Date): boolean {
    const hour = endTime.getHours();
    return hour >= 19;
  }
}
