import { BlogIcon, EditIcon, GithubIcon, LinkedInIcon, MailIcon } from '@/components/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserData } from '.';

interface UserInfoProps {
  userData: UserData | undefined;
  toggleEditing: () => void;
}

function UserInfo({ userData, toggleEditing }: UserInfoProps) {
  return (
    <div className="flex flex-row h-1/2 w-full justify-center gap-10">
      <>
        <div className="flex flex-col justify-center w-64 h-full gap-5">
          <Avatar className="w-64 h-64">
            <AvatarImage src={userData?.profileImage} />
            <AvatarFallback>MY</AvatarFallback>
          </Avatar>
          <div className="text-center font-bold text-text-strong text-4xl">{userData?.name}</div>
        </div>
        <div className="flex items-center items w-1/3 h-full">
          <div className="flex flex-col h-3/5 justify-between">
            <div className="flex flex-row gap-5 items-center">
              <span className="font-bold text-text-strong text-4xl">
                {userData?.camperId ? userData.camperId : '???'}
              </span>
              <div className="flex justify-center items-center bg-surface-brand-default text-text-strong text-display-bold24 h-full w-24 rounded">
                {userData?.field ? userData.field : '???'}
              </div>
              <button onClick={toggleEditing}>
                <EditIcon size={24} />
              </button>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <MailIcon size={27} className="text-text-strong" />
              <span className="text-text-strong text-display-bold24 w-24 h-full">email</span>
              <span className="text-text-strong text-display-medium16">{userData?.contacts.email}</span>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <GithubIcon size={27} className="text-text-strong" />
              <span className="text-text-strong text-display-bold24 w-24 h-full">Github</span>
              <span className="text-text-strong text-display-medium16">{userData?.contacts.github}</span>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <BlogIcon size={27} className="text-text-strong" />
              <span className="text-text-strong text-display-bold24 w-24 h-full">Blog</span>
              <span className="text-text-strong text-display-medium16">{userData?.contacts.blog}</span>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <LinkedInIcon size={27} className="text-text-strong" />
              <span className="text-text-strong text-display-bold24 w-24 h-full">LinkedIn</span>
              <span className="text-text-strong text-display-medium16">{userData?.contacts.linkedIn}</span>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default UserInfo;
