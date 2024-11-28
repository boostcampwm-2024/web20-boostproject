import { Body, Controller, Patch, Post } from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Controller('v1/records')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  async createRecord(@Body() createRecordDto: CreateRecordDto) {
    return this.recordService.createRecord(createRecordDto);
  }

  @Patch()
  async updateRecord(@Body() updateRecordDto: UpdateRecordDto) {
    return this.recordService.updateRecord(updateRecordDto);
  }
}
