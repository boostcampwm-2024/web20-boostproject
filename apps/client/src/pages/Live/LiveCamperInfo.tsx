import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { Badge } from '@components/ui/badge';
import IconButton from '@components/IconButton';
import { MailIcon, GithubIcon, BlogIcon, LinkedInIcon } from '@/components/Icons';
import { useAPI } from '@hooks/useAPI';
import { LiveInfo } from '@/types/liveTypes';
import LoadingCharacter from '@components/LoadingCharacter';
import ErrorCharacter from '@components/ErrorCharacter';

function LiveCamperInfo({ liveId }: { liveId: string }) {
  const { data, isLoading, error } = useAPI<LiveInfo>({ url: `v1/broadcasts/${liveId}/info` });

  return (
    <>
      {error || !data ? (
        <div className="text-text-danger flex justify-center items-center">
          <ErrorCharacter size={120} message="방송 정보 조회에 실패했습니다." />
        </div>
      ) : isLoading ? (
        <LoadingCharacter size={100} />
      ) : (
        <div className="flex flex-row justify-between">
          <div className="flex flex-col gap-4 pr-24">
            {/* 제목 */}
            <h1 className="text-text-strong font-bold text-2xl">{data.title}</h1>

            <div className="flex items-center gap-4">
              {/* 프로필 사진 */}
              <Avatar className="h-12 w-12">
                <AvatarImage src={data.profileImage} alt={data.camperId} />
                <AvatarFallback>{data.camperId}</AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-text-default font-medium text-display-medium16">{data.camperId}</span>
                  <Badge
                    variant="outline"
                    className="text-display-medium14 font-medium px-2 py-0.5 text-text-default border-border-default bg-transparent"
                  >
                    {data.field}
                  </Badge>
                </div>
                <span className="text-text-weak text-display-medium12">{data.viewers}명 시청 중</span>
              </div>
            </div>
          </div>

          {/* 우측 상단 아이콘들 - 2x2 그리드 */}
          <div className="grid grid-cols-2 gap-2">
            <IconButton
              title="email"
              ariaLabel="email"
              disabled={!data.contacts.email}
              onClick={() => window.open(`mailto:${data.contacts.email}`)}
            >
              <MailIcon size={24} />{' '}
            </IconButton>

            <IconButton
              title="블로그"
              ariaLabel="블로그"
              disabled={!data.contacts.blog}
              onClick={() => window.open(data.contacts.blog, '_blank')}
            >
              <BlogIcon size={24} />
            </IconButton>

            <IconButton disabled={!data.contacts.github} onClick={() => window.open(data.contacts.github, '_blank')}>
              <GithubIcon size={24} />
            </IconButton>

            <IconButton
              disabled={!data.contacts.linkedin}
              onClick={() => window.open(data.contacts.linkedin, '_blank')}
            >
              <LinkedInIcon size={24} />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
}

export default LiveCamperInfo;
