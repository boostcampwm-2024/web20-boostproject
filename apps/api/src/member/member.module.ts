import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberController } from './member.controller';
import { AttendanceModule } from 'src/attendance/attendance.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), AttendanceModule],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService, TypeOrmModule],
})
export class MemberModule {}
