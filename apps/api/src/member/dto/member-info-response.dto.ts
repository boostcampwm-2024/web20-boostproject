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
}
