import { ApiProperty } from '@nestjs/swagger';
import { Record } from '../record.entity';

class RecordDto {
  @ApiProperty()
  recordId: number;

  @ApiProperty()
  video: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  date: string;

  static from(record: Record) {
    const dto = new RecordDto();
    dto.recordId = record.id;
    dto.video = record.video;
    dto.title = record.title;
    dto.date = this.formatDate(new Date(record.attendance.startTime));
    return dto;
  }

  static fromList(records: Record[]) {
    return records.map(record => this.from(record));
  }

  private static formatDate(date: Date): string {
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .slice(0, -1);
  }
}

export class RecordsResponseDto {
  @ApiProperty({
    type: RecordDto,
    isArray: true,
  })
  records: RecordDto[];

  static from(records: Record[]) {
    const dto = new RecordsResponseDto();
    dto.records = RecordDto.fromList(records);

    return dto;
  }
}
