import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { Repository } from 'typeorm';
import { Broadcast } from 'src/broadcast/broadcast.entity';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private readonly attendanceRepository: Repository<Attendance>) {}

  async createAttendance(broadcast: Broadcast) {
    const attendance = this.attendanceRepository.create({
      startTime: broadcast.startTime,
      member: broadcast.member,
      broadcastId: broadcast.id,
    });

    await this.attendanceRepository.save(attendance);
  }

  async updateAttendance(broadcastId: string) {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        broadcastId,
      },
    });

    attendance.endTime = new Date();
    attendance.isAttended();

    this.attendanceRepository.update(attendance.id, attendance);
  }
}
