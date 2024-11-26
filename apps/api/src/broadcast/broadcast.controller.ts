import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { SuccessStatus } from '../common/responses/bases/successStatus';
import { BroadcastListResponseDto } from './dto/broadcast-list-response.dto';
import { BroadcastInfoResponseDto } from './dto/broadcast-info-response.dto';
import { UpdateBroadcastTitleDto } from './dto/update-broadcast-title.request.dto';
import { Broadcast } from './broadcast.entity';
import { CreateBroadcastDto } from './dto/createBroadcast.dto';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerTag } from 'src/common/constants/swagger-tag.enum';
import { ApiSuccessResponse } from 'src/common/decorators/success-res.decorator';
import { ApiErrorResponse } from 'src/common/decorators/error-res.decorator';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { BroadcastSearchResponseDto } from './dto/broadcast-search-response.dto';
import { FieldEnum } from 'src/member/enum/field.enum';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserReq } from 'src/common/decorators/user-req.decorator';
import { Member } from 'src/member/member.entity';
import { BroadcastListDto } from './dto/broadcast-list.dto';

@Controller('v1/broadcasts')
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Get()
  @ApiTags(SwaggerTag.MAIN)
  @ApiOperation({ summary: '방송 리스트 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(BroadcastListResponseDto), BroadcastListResponseDto)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async getAllWithFilterAndPagination(@Query() queries: BroadcastListDto) {
    const { field } = queries;

    if (field && !Object.values(FieldEnum).includes(field as FieldEnum)) {
      throw new CustomException(ErrorStatus.INVALID_FIELD);
    }

    const { broadcasts, nextCursor } = await this.broadcastService.getAllWithFilterAndPagination(queries);

    return BroadcastListResponseDto.from(broadcasts, nextCursor);
  }

  @Get('/:broadcastId/info')
  @ApiTags(SwaggerTag.WATCH)
  @ApiOperation({ summary: '방송 하단 정보 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(BroadcastInfoResponseDto), BroadcastInfoResponseDto)
  @ApiErrorResponse(400, ErrorStatus.BROADCAST_NOT_FOUND)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async getBroadcastInfo(@Param('broadcastId') broadcastId: string) {
    const broadcast = await this.broadcastService.getBroadcastInfo(broadcastId);

    return BroadcastInfoResponseDto.from(broadcast);
  }

  @Patch('/title')
  @UseGuards(JWTAuthGuard)
  @ApiTags(SwaggerTag.BROADCAST)
  @ApiOperation({ summary: '방송 제목 수정' })
  @ApiBody({ type: UpdateBroadcastTitleDto })
  @ApiSuccessResponse(SuccessStatus.OK(null))
  @ApiErrorResponse(400, ErrorStatus.BROADCAST_NOT_FOUND)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async updateTitle(@UserReq() member: Member, @Body() updateBroadcastTitleDto: UpdateBroadcastTitleDto) {
    await this.broadcastService.updateTitle(member.id, updateBroadcastTitleDto);

    return SuccessStatus.OK(null, '제목 수정이 완료 되었습니다.');
  }

  @Get('/search')
  @ApiTags(SwaggerTag.MAIN)
  @ApiOperation({ summary: '방송 검색' })
  @ApiSuccessResponse(SuccessStatus.OK(BroadcastSearchResponseDto), BroadcastSearchResponseDto)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async searchBroadcasts(@Query('keyword') keyword: string) {
    const broadcasts = await this.broadcastService.searchBroadcasts(keyword);
    return SuccessStatus.OK(BroadcastSearchResponseDto.fromList(broadcasts));
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
