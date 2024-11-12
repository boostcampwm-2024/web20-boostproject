import { Module } from '@nestjs/common';
import { BroadcastController } from './broadcast.controller';
import { BroadcastService } from './broadcast.service';
import { Broadcast } from './broadcast.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcast])],
  controllers: [BroadcastController],
  providers: [BroadcastService],
})
export class BroadcastModule {}
