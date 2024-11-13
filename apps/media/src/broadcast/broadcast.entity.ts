import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Member } from '../member/member.entity';

@Entity()
export class Broadcast {
  @PrimaryColumn()
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  @Column({ default: 0 })
  viewers: number;

  // startTime과 createdAt이 시간과 날짜를 분리해서 나타내는 거라면, 하나의 변수로 합치는 건 어떨까?
  @Column()
  startTime: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @OneToOne(() => Member)
  @JoinColumn({ name: 'memberId' })
  member: Member;
}
