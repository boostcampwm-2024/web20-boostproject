import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
