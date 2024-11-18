import { FieldEnum } from '../../member/enum/field.enum';
import { Broadcast } from '../broadcast.entity';

export class BroadcastInfoResponseDto {
  title: string;
  camperId: string;
  field: FieldEnum;
  viewers: number;
  profileImage: string;
  contacts: {
    github: string;
    linkedin: string;
    email: string;
    blog: string;
  };

  static from(broadcast: Broadcast) {
    const dto = new BroadcastInfoResponseDto();
    dto.title = broadcast.title;
    dto.camperId = broadcast.member ? broadcast.member.filed : 'J000';
    dto.field = broadcast.member ? broadcast.member.filed : FieldEnum.WEB;
    dto.viewers = broadcast.viewers;
    dto.profileImage = broadcast.member ? broadcast.member.profileImage : '';
    dto.contacts = {
      github: broadcast.member ? broadcast.member.github : '',
      linkedin: broadcast.member ? broadcast.member.linkedin : '',
      email: broadcast.member ? broadcast.member.email : '',
      blog: broadcast.member ? broadcast.member.blog : '',
    };
    return dto;
  }
}
