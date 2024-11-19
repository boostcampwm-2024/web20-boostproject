import { Module } from '@nestjs/common';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';
import { Broadcast } from './broadcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/attendance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcast]), TypeOrmModule.forFeature([Attendance])],
  controllers: [BroadcastController],
  providers: [BroadcastService],
})
export class BroadcastModule {}
