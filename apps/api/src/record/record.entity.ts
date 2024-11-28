import { Attendance } from 'src/attendance/attendance.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Record {
  @PrimaryGeneratedColumn({ name: 'recordId' })
  id: number;

  @Column({ type: 'text', nullable: true })
  video: string;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => Attendance)
  @JoinColumn({ name: 'attendanceId' })
  attendance: Attendance;
}
