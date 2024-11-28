import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './record.entity';
import { RecordService } from './record.service';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { RecordController } from './record.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), AttendanceModule],
  controllers: [RecordController],
  providers: [RecordService],
})
export class RecordModule {}
