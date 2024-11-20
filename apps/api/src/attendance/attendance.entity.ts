import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../member/member.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'attendanceId' })
  id: number;

  @Column()
  attended: boolean;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'memberId' })
  member: Member;

  /**
   * isAttended: 네부캠 출석 시간에 대해 부합하면 true
   */
  public static isAttended(startTime: Date, endTime: Date) {
    return this.isValidStartTime(startTime) && this.isValidEndTime(endTime);
  }

  // 9시 30분 ~ 10시 사이 === true
  private static isValidStartTime(startTime: Date): boolean {
    const hour = startTime.getHours();
    const minutes = startTime.getMinutes();
    return (hour === 9 && minutes >= 30) || (hour === 10 && minutes === 0);
  }

  // 19시 이후 === true
  private static isValidEndTime(endTime: Date): boolean {
    const hour = endTime.getHours();
    return hour >= 19;
  }
}
