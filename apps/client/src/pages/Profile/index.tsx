import Attendance from './Attendance';
import UserInfo from './UserInfo';

export default function Profile() {
  return (
    <div className="flex flex-col w-full h-full gap-10">
      <UserInfo />
      <Attendance />
    </div>
  );
}
