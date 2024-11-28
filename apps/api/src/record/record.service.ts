import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { Repository } from 'typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { Attendance } from 'src/attendance/attendance.entity';
import { UpdateRecordDto } from './dto/update-record.dto';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';

@Injectable()
export class RecordService {
  private readonly videoUrl: string;

  constructor(
    @InjectRepository(Record) private recordRepository: Repository<Record>,
    @InjectRepository(Attendance) private attendanceRepository: Repository<Attendance>,
  ) {}

  async getRecordsByAttendanceId(attendanceId: string) {
    return await this.recordRepository
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendance', 'attendance')
      .where('attendance.id = :attendanceId AND record.video IS NOT NULL', { attendanceId })
      .getMany();
  }

  async createRecord({ title, roomId }: CreateRecordDto) {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        broadcastId: roomId,
      },
    });

    const record = this.recordRepository.create({
      title,
      attendance,
    });

    this.recordRepository.save(record);
  }

  async updateRecord({ roomId, video }: UpdateRecordDto) {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        broadcastId: roomId,
      },
    });

    if (!attendance) new CustomException(ErrorStatus.ATTENDANCE_NOT_FOUND);

    await this.recordRepository
      .createQueryBuilder('record')
      .update(Record)
      .set({ video })
      .where('attendanceId = :attendanceId AND video IS NULL', { attendanceId: attendance.id })
      .execute();
  }
}
