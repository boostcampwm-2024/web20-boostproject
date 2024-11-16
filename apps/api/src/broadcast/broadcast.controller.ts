import { Controller, Get } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { SuccessStatus } from '../common/responses/bases/successStatus';
import { BroadcastListResponseDto } from './dto/broadcast-list-response.dto';

@Controller('broadcasts')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Get()
  async getAll() {
    const broadcasts = await this.broadcastService.getAll();
    return SuccessStatus.OK(BroadcastListResponseDto.from(broadcasts));
  }
}
