import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateBroadcastTitleDto {
  @IsString()
  @MinLength(1, { message: '제목은 최소 1자 이상이어야 합니다.' })
  @MaxLength(255, { message: '제목 글자 수 제한을 초과했습니다.' })
  title: string;
}
