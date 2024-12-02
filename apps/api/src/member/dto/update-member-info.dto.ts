import { FieldEnum } from '../enum/field.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../member.entity';

class Contacts {
  @ApiProperty({ example: 'test@naver.com' })
  email: string;
  @ApiProperty()
  github: string;
  @ApiProperty()
  blog: string;
  @ApiProperty()
  linkedin: string;
}

export class UpdateMemberInfoDto {
  @ApiProperty({ example: '홍길동' })
  name: string;
  @ApiProperty({ example: 'J000' })
  camperId: string;
  @ApiProperty({ example: 'WEB' })
  field: FieldEnum;
  @ApiProperty({ type: Contacts })
  contacts: Contacts;

  toMember() {
    const member = new Member();
    member.name = this.name;
    member.camperId = this.camperId;
    member.field = this.field;
    member.email = this.contacts.email;
    member.github = this.contacts.github;
    member.blog = this.contacts.blog;
    member.linkedin = this.contacts.linkedin;
    return member;
  }
}
