import { ApiProperty } from '@nestjs/swagger';
import { FieldEnum } from '../../member/enum/field.enum';
import { Broadcast } from '../broadcast.entity';
class BroadcastDto {
  @ApiProperty()
  broadcastId: string;

  @ApiProperty()
  broadcastTitle: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  camperId: string;

  @ApiProperty()
  profileImage: string;

  @ApiProperty()
  field: FieldEnum;

  static from(broadcast: Broadcast) {
    const dto = new BroadcastDto();
    dto.broadcastId = broadcast.id;
    dto.broadcastTitle = broadcast.title;
    dto.thumbnail = broadcast.thumbnail;
    dto.camperId = broadcast.member ? broadcast.member.camperId : '';
    dto.profileImage = broadcast.member ? broadcast.member.profileImage : '';
    dto.field = broadcast.member ? broadcast.member.field : FieldEnum.WEB;
    return dto;
  }

  static fromList(broadcasts: Broadcast[]) {
    return broadcasts.map(broadcast => this.from(broadcast));
  }
}

export class BroadcastListResponseDto {
  @ApiProperty({
    type: BroadcastDto,
    example: [
      {
        id: '73ebe906-0897-478d-b7c6-42f5ba7abc0a',
        title: '오늘 코딩 켠왕 간다',
        thumbnail: 'thumbnail.jpg',
        camperId: 'J219',
        profileImage: 'profile.jpg',
        field: 'WEB',
      },
    ],
  })
  broadcasts: BroadcastDto[];

  @ApiProperty({ example: '73ebe906-0897-478d-b7c6-42f5ba7abc0a' })
  nextCursor: string;

  static from(broadcasts: Broadcast[], nextCursor: string) {
    const dto = new BroadcastListResponseDto();
    dto.broadcasts = BroadcastDto.fromList(broadcasts);
    dto.nextCursor = nextCursor;
    return dto;
  }
}
