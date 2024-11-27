import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../member/member.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'attendanceId' })
  id: number;

  @Column({ nullable: true })
  attended: boolean;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime: Date;

  @Column({ nullable: false })
  broadcastId: string;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'memberId' })
  member: Member;

  /**
   * isAttended: 네부캠 출석 시간에 대해 부합하면 true
   */
  isAttended() {
    this.attended = this.isValidStartTime() && this.isValidEndTime();
  }

  // 9시 30분 ~ 10시 사이 === true
  private isValidStartTime() {
    const hour = this.startTime.getHours();
    const minutes = this.startTime.getMinutes();
    return (hour === 9 && minutes >= 30) || (hour === 10 && minutes === 0);
  }

  // 19시 이후 === true
  private isValidEndTime() {
    const hour = this.endTime.getHours();
    return hour >= 19;
  }
}
