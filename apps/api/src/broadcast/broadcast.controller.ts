import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { SuccessStatus } from '../common/responses/bases/successStatus';
import { BroadcastListResponseDto } from './dto/broadcast-list-response.dto';
import { BroadcastInfoResponseDto } from './dto/broadcast-info-response.dto';
import { UpdateBroadcastTitleDto } from './dto/update-broadcast-title.request.dto';
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

  @Get('/:broadcastId/info')
  async getBroadcastInfo(@Param('broadcastId') broadcastId: string) {
    const broadcast = await this.broadcastService.getBroadcastInfo(broadcastId);

    return SuccessStatus.OK(BroadcastInfoResponseDto.from(broadcast));
  }

  // TODO: 유저 기능 추가 후 유저의 방송 찾는 로직 구현 필요
  @Patch('/title')
  // @UseGuards(JwtAuthGuard)
  async updateTitle(
    // @Request() req,
    @Body() updateBroadcastTitleDto: UpdateBroadcastTitleDto,
  ) {
    await this.broadcastService.updateTitle(null, updateBroadcastTitleDto);

    return SuccessStatus.OK(null, '제목 수정이 완료 되었습니다.');
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

  @Delete('/:broadcastId')
  async deleteBroadcast(@Param('broadcastId') broadcastId: string): Promise<void> {
    return await this.broadcastService.deleteBroadcast(broadcastId);
  }
}
