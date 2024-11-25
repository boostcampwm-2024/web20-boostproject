import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance])],
  exports: [TypeOrmModule.forFeature([Attendance])],
})
export class AttendanceModule {}
