import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { RecordsResponseDto } from './dto/records-response.dto';
import { SwaggerTag } from 'src/common/constants/swagger-tag.enum';
import { ApiSuccessResponse } from 'src/common/decorators/success-res.decorator';
import { SuccessStatus } from 'src/common/responses/bases/successStatus';
import { ApiErrorResponse } from 'src/common/decorators/error-res.decorator';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('v1/records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Get(':attendanceId')
  @ApiTags(SwaggerTag.MYPAGE)
  @ApiOperation({ summary: '녹화 리스트 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(RecordsResponseDto), RecordsResponseDto)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async getRecordsByAttendanceId(@Param('attendanceId') attendanceId: string) {
    const records = await this.recordService.getRecordsByAttendanceId(attendanceId);

    return RecordsResponseDto.fromList(records);
  }

  @Post()
  async createRecord(@Body() createRecordDto: CreateRecordDto) {
    return this.recordService.createRecord(createRecordDto);
  }

  @Patch()
  async updateRecord(@Body() updateRecordDto: UpdateRecordDto) {
    return this.recordService.updateRecord(updateRecordDto);
  }
}
