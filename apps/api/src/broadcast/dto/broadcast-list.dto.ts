import { ApiProperty } from '@nestjs/swagger';
import { FieldEnum } from '../../member/enum/field.enum';

export class BroadcastListDto {
  @ApiProperty({ example: 'WEB', required: false })
  field?: FieldEnum = null;

  @ApiProperty({ example: '73ebe906-0897-478d-b7c6-42f5ba7abc0a', required: false })
  cursor?: string = null;

  @ApiProperty({ example: 12, required: false })
  limit: number = 12;
}
