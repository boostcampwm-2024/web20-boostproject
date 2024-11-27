import { Module } from '@nestjs/common';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';
import { Broadcast } from './broadcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceModule } from 'src/attendance/attendance.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcast]), AttendanceModule, MemberModule],
  controllers: [BroadcastController],
  providers: [BroadcastService],
})
export class BroadcastModule {}
