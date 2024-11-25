import { Attendance } from 'src/attendance/attendance.entity';

export class AttendanceResponseDto {
  id: number;
  attendances: {
    date: string;
    startTime: string;
    endTime: string;
    isAttendance: boolean;
  }[];

  static of(memberId: number, attendances: Attendance[]): AttendanceResponseDto {
    return {
      id: memberId,
      attendances: attendances.map(attendance => ({
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
