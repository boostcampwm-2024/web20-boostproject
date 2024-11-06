import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [MemberModule, BroadcastModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
