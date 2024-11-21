export class CreateBroadcastDto {
  id: string;
  title: string; // 방송 제목
  thumbnail: string;
  memberId: number; // 토큰을 통해 뽑기

  static of(id: string, title: string, thumbnail: string, memberId: number) {
    const createBroadcastDto = new CreateBroadcastDto();
    createBroadcastDto.id = id;
    createBroadcastDto.title = title;
    createBroadcastDto.thumbnail = thumbnail;
    createBroadcastDto.memberId = memberId;
    return createBroadcastDto;
  }
}
