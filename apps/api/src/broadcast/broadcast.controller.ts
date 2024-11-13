import { Controller, Get } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { SuccessStatus } from '../common/responses/bases/successStatus';

@Controller('broadcasts')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Get()
  async getAll() {
    const broadcasts = await this.broadcastService.getAll();
    return SuccessStatus.OK(broadcasts);
  }
}
