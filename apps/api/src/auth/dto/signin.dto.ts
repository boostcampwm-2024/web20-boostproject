import { Member } from 'src/member/member.entity';

export class SigninDto {
  email: string;
  name: string;
  profileImage: string;
  github?: string = null;

  toMember() {
    const member = new Member();

    member.email = this.email;
    member.name = this.name;
    member.profileImage = this.profileImage;
    member.github = this.github;

    return member;
  }
}
