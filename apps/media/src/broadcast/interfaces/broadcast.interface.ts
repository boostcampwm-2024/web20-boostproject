export interface IBroadcast {
  id: string;
  title: string;
  viewers: number;
  member: any; // 타입은 실제 Member 타입으로 변경
}
