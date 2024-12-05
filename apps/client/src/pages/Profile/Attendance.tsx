import ErrorCharacter from '@/components/ErrorCharacter';
import { PlayIcon } from '@/components/Icons';
import LoadingCharacter from '@/components/LoadingCharacter';
import axiosInstance from '@/services/axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AttendanceData {
  attendanceId: number;
  date: string;
  startTime: string;
  endTime: string;
  isAttendance: boolean;
}

function Attendance() {
  const [attendanceList, setAttendanceList] = useState<AttendanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get('/v1/members/attendance')
      .then(response => {
        if (response.data.success) {
          setAttendanceList(response.data.data.attendances);
        } else {
          setError(new Error(response.data.message));
        }
      })
      .catch(error => setError(error instanceof Error ? error : new Error(error)))
      .finally(() => {
        setIsLoading(false);
      });
  }, [setAttendanceList, setError]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 250);

    return () => clearTimeout(timer);
  });

  const handlePlayRecord = (attendanceId: number) => {
    navigate(`/record/${attendanceId}`);
  };

  return (
    <div className="flex justify-center h-1/2 w-full">
      <div className="flex flex-col h-full w-[80vw] border border-border-bold border-b-transparent rounded-t">
        <div className="flex flex-row justify-around items-center gap-11 bg-surface-alt w-full h-14 rounded-t">
          {['학습일', '시작 시간', '종료 시간', '출석 여부'].map((data: string, idx) => (
            <div key={idx} className="flex flex-1 justify-center items-center text-display-bold24 text-text-bold">
              {data}
            </div>
          ))}
        </div>
        {showLoading && isLoading ? (
          <div className="flex justify-center items-center h-full">
            <LoadingCharacter size={200} />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <ErrorCharacter size={200} message="출석부 조회에 실패했습니다" />
          </div>
        ) : (
          <div className="overflow-y-auto text-text-default text-display-medium16">
            {attendanceList?.map(data => (
              <div key={data.attendanceId} className="flex flex-row justify-around items-center h-12 border-b gap-11">
                <div className="flex flex-1 justify-center items-center">{data.date}</div>
                <div className="flex flex-1 justify-center items-center">{data.startTime}</div>
                <div className="flex flex-1 justify-center items-center">{data.endTime}</div>
                <div className="flex flex-1 justify-center items-center">
                  <div className="flex flex-row items-center justify-between gap-3">
                    <span className={data.isAttendance ? 'text-text-default' : 'text-text-danger'}>
                      {data.isAttendance ? '출석' : '결석'}
                    </span>
                    <button onClick={() => handlePlayRecord(data.attendanceId)} aria-label="녹화 영상 보기">
                      <PlayIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Attendance;
