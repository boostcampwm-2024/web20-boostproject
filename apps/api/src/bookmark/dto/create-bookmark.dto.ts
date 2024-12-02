import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBookmarkDto {
  @ApiProperty()
  @IsString({ message: '북마크 이름은 string 형식이어야 합니다.' })
  name: string;

  @ApiProperty()
  @IsString({ message: '북마크 링크는 string 형식이어야 합니다.' })
  url: string;
}
