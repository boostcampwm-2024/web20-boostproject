import ErrorCharacter from '@/components/ErrorCharacter';
import { PlayIcon } from '@/components/Icons';
// import axiosInstance from '@/services/axios';
import { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

interface AttendanceData {
  date: string;
  startTime: string;
  endTime: string;
  isAttendance: boolean;
}

const mocks = [
  {
    date: '2024.11.07',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.08',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.09',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: false,
  },
  {
    date: '2024.11.10',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.11',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.12',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.13',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.14',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.15',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: false,
  },
  {
    date: '2024.11.16',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
  {
    date: '2024.11.17',
    startTime: '10:00:00',
    endTime: '19:00:00',
    isAttendance: true,
  },
];

function Attendance() {
  const [attendanceList, setAttendanceList] = useState<AttendanceData[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // const navigate = useNavigate();

  useEffect(() => {
    // axiosInstance
    //   .get('/v1/members/attendance')
    //   .then(response => {
    //     if (response.data.success) {
    //       setAttendanceList(response.data.data.attendances);
    //     }
    //   })
    //   .catch(error => setError(error instanceof Error ? error : new Error(error)));
    setError(null);
    setAttendanceList(mocks);
  }, []);

  const handlePlayRecord = () => {
    alert('녹화 화면 보러가기');
  };

  return (
    <div className="flex justify-center h-1/2 w-full">
      {error ? (
        <ErrorCharacter size={200} message={error.message} />
      ) : (
        <div className="flex flex-col h-full w-[80vw] border border-border-bold border-b-transparent rounded-t">
          <div className="flex flex-row justify-around items-center gap-11 bg-surface-alt w-full h-14 rounded-t">
            {['학습일', '시작 시간', '종료 시간', '출석 여부'].map((data: string, idx) => (
              <div key={idx} className="flex flex-1 justify-center items-center text-display-bold24 text-text-bold">
                {data}
              </div>
            ))}
          </div>
          <div className="overflow-y-auto text-text-default text-display-medium16">
            {attendanceList?.map((data, idx) => (
              <div key={idx} className="flex flex-row justify-around items-center h-12 border-b gap-11">
                <div className="flex flex-1 justify-center items-center">{data.date}</div>
                <div className="flex flex-1 justify-center items-center">{data.startTime}</div>
                <div className="flex flex-1 justify-center items-center">{data.endTime}</div>
                <div className="flex flex-1 justify-center items-center">
                  <div className="flex flex-row items-center justify-between gap-3">
                    <span className={data.isAttendance ? 'text-text-default' : 'text-text-danger'}>
                      {data.isAttendance ? '출석' : '결석'}
                    </span>
                    <button onClick={handlePlayRecord} aria-label="녹화 영상 보기">
                      <PlayIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Attendance;
