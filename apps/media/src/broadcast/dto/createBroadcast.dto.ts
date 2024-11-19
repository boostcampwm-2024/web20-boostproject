export class CreateBroadcastDto {
  id: string;
  title: string; // 방송 제목
  memberId: number; // 토큰을 통해 뽑기

  static of(id: string, title: string, memberId: number): CreateBroadcastDto {
    const createBroadcastDto = new CreateBroadcastDto();
    createBroadcastDto.id = id;
    createBroadcastDto.title = title;
    createBroadcastDto.memberId = memberId;
    return createBroadcastDto;
  }
}
