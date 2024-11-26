import { ApiProperty } from '@nestjs/swagger';
import { Member } from '../member.entity';

export class ProfileImageDto {
  @ApiProperty()
  memberId: number;
  @ApiProperty()
  profileImage: string;

  static from(member: Member) {
    const dto = new ProfileImageDto();
    dto.memberId = member.id;
    dto.profileImage = member.profileImage;
    return dto;
  }
}
