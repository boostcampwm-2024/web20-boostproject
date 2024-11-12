import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Broadcast } from './broadcast.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Broadcast])],
  providers: [],
})
export class BroadcastModule {}
