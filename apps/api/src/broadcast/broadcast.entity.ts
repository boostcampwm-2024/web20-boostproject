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

  @Column()
  startTime: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @OneToOne(() => Member)
  @JoinColumn({ name: 'memberId' })
  member: Member;
}
