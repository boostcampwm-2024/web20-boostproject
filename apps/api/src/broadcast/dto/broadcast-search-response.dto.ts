import { Broadcast } from '../broadcast.entity';
import { FieldEnum } from '../../member/enum/field.enum';

export class BroadcastSearchResponseDto {
  broadcastId: string;
  broadcastTitle: string;
  thumbnail: string;
  camperId: string;
  profileImage: string;
  field: FieldEnum;

  static from(broadcast: Broadcast): BroadcastSearchResponseDto {
    const dto = new BroadcastSearchResponseDto();
    dto.broadcastId = broadcast.id;
    dto.broadcastTitle = broadcast.title;
    dto.thumbnail = broadcast.thumbnail;
    dto.camperId = broadcast.member?.camperId;
    dto.profileImage = broadcast.member?.profileImage;
    dto.field = broadcast.member?.filed;
    return dto;
  }

  static fromList(broadcasts: Broadcast[]): BroadcastSearchResponseDto[] {
    return broadcasts.map(broadcast => this.from(broadcast));
  }
}
