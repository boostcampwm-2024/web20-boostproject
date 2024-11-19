import { ApiProperty } from '@nestjs/swagger';
import { FieldEnum } from '../../member/enum/field.enum';
import { Broadcast } from '../broadcast.entity';

export class BroadcastListResponseDto {
  @ApiProperty({ example: '73ebe906-0897-478d-b7c6-42f5ba7abc0a' })
  broadcastId: string;

  @ApiProperty({ example: '오늘 코딩 켠왕 간다' })
  broadcastTitle: string;

  @ApiProperty({ example: 'thunbnail 주소 src' })
  thumbnail: string;

  @ApiProperty({ example: 'J219' })
  camperId: string;

  @ApiProperty({ example: 'profile Image 주소 src' })
  profileImage: string;

  @ApiProperty({ example: 'WEB' })
  field: FieldEnum;

  static from(broadcasts: Broadcast[]) {
    return broadcasts.map(broadcast => {
      const dto = new BroadcastListResponseDto();
      dto.broadcastId = broadcast.id;
      dto.broadcastTitle = broadcast.title;
      dto.thumbnail = broadcast.thumbnail;
      dto.camperId = broadcast.member ? broadcast.member.camperId : '';
      dto.profileImage = broadcast.member ? broadcast.member.profileImage : '';
      dto.field = broadcast.member ? broadcast.member.filed : FieldEnum.WEB;
      return dto;
    });
  }
}
