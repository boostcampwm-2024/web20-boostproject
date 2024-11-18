import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import IconButton from './common/IconButton';
import MailIcon from './icons/MailIcon';
import GithubIcon from './icons/GithubIcon';
import BlogIcon from './icons/BlogIcon';
import LinkedInIcon from './icons/LinkedInIcon';

interface ContactInfo {
  github: string;
  linkedin: string;
  email: string;
  blog: string;
}

interface LiveCamperInfo {
  title: string;
  camperId: string;
  participants: number;
  field: 'WEB' | 'AND' | 'IOS';
  profileImage: string;
  contacts: ContactInfo;
}

const liveCamperInfo = {
  title: '안녕하세요 이건 방송 제목입니다 테스트하기 위해 이렇게 적고 있어요 50글자아 안녕히계세요',
  camperId: 'J999',
  participants: 999,
  field: 'WEB',
  profileImage: '/images/duck.png',
  contacts: {
    github: 'https://github.com/zero0205',
    linkedin: '',
    email: '',
    blog: '',
  },
};

const LiveCamperInfo = () => {
  return (
    <div className="relative w-full p-4 bg-surface-default">
      <div className="flex flex-col gap-4 pr-24">
        {/* 제목 */}
        <h1 className="text-text-strong font-bold text-2xl">{liveCamperInfo.title}</h1>

        <div className="flex items-center gap-4">
          {/* 프로필 사진 */}
          <Avatar className="h-12 w-12">
            <AvatarImage src={liveCamperInfo.profileImage} alt={liveCamperInfo.camperId} />
            <AvatarFallback>{liveCamperInfo.camperId}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-text-default font-medium text-display-medium16">{liveCamperInfo.camperId}</span>
              <Badge
                variant="outline"
                className="text-display-medium14 font-medium px-2 py-0.5 text-text-default border-border-default bg-transparent"
              >
                {liveCamperInfo.field}
              </Badge>
            </div>
            <span className="text-text-weak text-display-medium12">
              {liveCamperInfo.participants.toLocaleString()}명 시청 중
            </span>
          </div>
        </div>
      </div>

      {/* 우측 상단 아이콘들 - 2x2 그리드 */}
      <div className="absolute top-4 right-4 grid grid-cols-2 gap-2">
        <IconButton
          title="email"
          ariaLabel="email"
          disabled={!liveCamperInfo.contacts.email}
          onClick={() => window.open(`mailto:${liveCamperInfo.contacts.email}`)}
        >
          <MailIcon size={24} />{' '}
        </IconButton>

        <IconButton
          title="블로그"
          ariaLabel="블로그"
          disabled={!liveCamperInfo.contacts.blog}
          onClick={() => window.open(liveCamperInfo.contacts.blog, '_blank')}
        >
          <BlogIcon size={24} />
        </IconButton>

        <IconButton
          disabled={!liveCamperInfo.contacts.github}
          onClick={() => window.open(liveCamperInfo.contacts.github, '_blank')}
        >
          <GithubIcon size={24} />
        </IconButton>

        <IconButton
          disabled={!liveCamperInfo.contacts.linkedin}
          onClick={() => window.open(liveCamperInfo.contacts.linkedin, '_blank')}
        >
          <LinkedInIcon size={24} />
        </IconButton>
      </div>
    </div>
  );
};

export default LiveCamperInfo;
