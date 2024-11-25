import { Member } from '../member.entity';

export class MemberInfoResponseDto {
  id: number;
  camperId: string;
  name: string;
  field: string;
  contacts: {
    email: string;
    github: string;
    blog: string;
    linkedIn: string;
  };
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
