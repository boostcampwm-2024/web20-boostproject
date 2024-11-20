import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBroadcastTitleDto {
  @IsString({ message: '제목은 string 형식이어야 합니다.' })
  @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
  @MaxLength(255, { message: '제목 글자 수 제한을 초과했습니다.' })
  @ApiProperty({ example: '오늘 코딩 켠왕 간다' })
  title: string;
}
