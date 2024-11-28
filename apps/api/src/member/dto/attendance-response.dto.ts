import { ApiProperty } from '@nestjs/swagger';
import { Attendance } from 'src/attendance/attendance.entity';

class AttendanceInfo {
  @ApiProperty()
  date: string;
  @ApiProperty()
  startTime: string;
  @ApiProperty()
  endTime: string;
  @ApiProperty()
  isAttendance: boolean;
}

export class AttendanceResponseDto {
  @ApiProperty()
  memberId: number;
  @ApiProperty({ type: AttendanceInfo, isArray: true })
  attendances: AttendanceInfo[];

  static of(memberId: number, attendances: Attendance[]): AttendanceResponseDto {
    return {
      memberId: memberId,
      attendances: attendances.map(attendance => ({
        attendanceId: attendance.id,
        date: this.formatDate(attendance.startTime),
        startTime: this.formatTime(attendance.startTime),
        endTime: this.formatTime(attendance.endTime),
        isAttendance: attendance.attended,
      })),
    };
  }

  private static formatDate(date: Date): string {
    return date
      .toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\. /g, '.')
      .slice(0, -1);
  }

  private static formatTime(date: Date): string {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }
}
