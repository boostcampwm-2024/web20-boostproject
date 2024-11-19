import { ApiProperty } from '@nestjs/swagger';
import { FieldEnum } from '../../member/enum/field.enum';
import { Broadcast } from '../broadcast.entity';

export class BroadcastInfoResponseDto {
  @ApiProperty({ example: '오늘 코딩 켠왕 간다' })
  title: string;

  @ApiProperty({ example: 'J219' })
  camperId: string;

  @ApiProperty({ example: 'WEB' })
  field: FieldEnum;

  @ApiProperty({ example: 99 })
  viewers: number;

  @ApiProperty({ example: 'profileImage 주소 src' })
  profileImage: string;

  @ApiProperty({
    example: {
      github: 'https://github/~',
      linkedin: 'https://linkedin/~',
      email: 'huiseon37@gmail.com',
      blog: 'https://tistory/~',
    },
  })
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
