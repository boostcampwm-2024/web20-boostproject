import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { SuccessStatus } from '../common/responses/bases/successStatus';
import { BroadcastListResponseDto } from './dto/broadcast-list-response.dto';
import { Broadcast } from './broadcast.entity';
import { CreateBroadcastDto } from './dto/createBroadcast.dto';

@Controller('v1/broadcasts')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Get()
  async getAll() {
    const broadcasts = await this.broadcastService.getAll();
    return SuccessStatus.OK(BroadcastListResponseDto.from(broadcasts));
  }

  @Post()
  async createBroadcast(@Body() createBroadcastDto: CreateBroadcastDto): Promise<Broadcast> {
    return this.broadcastService.createBroadcast(createBroadcastDto);
  }

  @Put(':id/viewers/increment')
  async incrementViewers(@Param('id') id: string): Promise<void> {
    return this.broadcastService.incrementViewers(id);
  }

  @Put(':id/viewers/decrement')
  async decrementViewers(@Param('id') id: string): Promise<void> {
    return this.broadcastService.decrementViewers(id);
  }
}
