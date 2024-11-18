import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../member/member.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'attendanceId' })
  id: number;

  @Column()
  date: Date;

  @Column()
  attended: boolean;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'memberId' })
  member: Member;
}
