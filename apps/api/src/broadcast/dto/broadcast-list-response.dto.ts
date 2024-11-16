import { FieldEnum } from '../../member/enum/field.enum';
import { Broadcast } from '../broadcast.entity';

export class BroadcastListResponseDto {
  broadcastId: string;
  broadcastTitle: string;
  thumbnail: string;
  camperId: string;
  profileImage: string;
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
