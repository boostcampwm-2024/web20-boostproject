import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../member.entity';

class ContactsDto {
  @ApiProperty()
  email: string;
  @ApiProperty()
  github: string;
  @ApiProperty()
  blog: string;
  @ApiProperty()
  linkedIn: string;
}

export class MemberInfoResponseDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  camperId: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  field: string;
  @ApiProperty({ type: ContactsDto })
  contacts: ContactsDto;
  @ApiProperty()
  profileImage: string;

  static from(member: Member): MemberInfoResponseDto {
    return {
      id: member.id,
      camperId: member.camperId,
      name: member.name,
      field: member.field,
      contacts: {
        email: member.email,
        github: member.github,
        blog: member.blog,
        linkedIn: member.linkedin,
      },
      profileImage: member.profileImage,
    };
  }
}
