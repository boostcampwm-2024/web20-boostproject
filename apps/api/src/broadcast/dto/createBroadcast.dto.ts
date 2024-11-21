export class CreateBroadcastDto {
  id: string;
  title: string; // 방송 제목
  thumbnail: string;
  memberId: number; // 토큰을 통해 뽑아오면 됌
}
