import { ApiProperty } from '@nestjs/swagger';
import { Record } from '../record.entity';

export class RecordsResponseDto {
  @ApiProperty()
  recordId: number;

  @ApiProperty()
  video: string;

  @ApiProperty()
  title: string;

  static from(record: Record) {
    const dto = new RecordsResponseDto();
    dto.recordId = record.id;
    dto.video = record.video;
    dto.title = record.title;
    return dto;
  }

  static fromList(records: Record[]) {
    return records.map(record => this.from(record));
  }
}
