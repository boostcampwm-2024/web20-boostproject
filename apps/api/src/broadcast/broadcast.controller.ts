import { Controller, Get, Param } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { SuccessStatus } from '../common/responses/bases/successStatus';
import { BroadcastListResponseDto } from './dto/broadcast-list-response.dto';
import { BroadcastInfoDto } from './dto/broadcast-info.dto';

@Controller('broadcasts')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Get()
  async getAll() {
    const broadcasts = await this.broadcastService.getAll();
    return SuccessStatus.OK(BroadcastListResponseDto.from(broadcasts));
  }

  @Get('/:broadcastId/info')
  async getBroadcastInfo(@Param('broadcastId') broadcastId: string) {
    const broadcast = await this.broadcastService.getBroadcastInfo(broadcastId);

    return SuccessStatus.OK(BroadcastInfoDto.from(broadcast));
  }
}
