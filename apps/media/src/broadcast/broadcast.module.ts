import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Broadcast } from './broadcast.entity';
import { BroadcastService } from './broadcast.service';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcast])],
  providers: [BroadcastService],
})
export class BroadcastModule {}
