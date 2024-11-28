import { useState } from 'react';
import RecordInfo from './RecordInfo';
import RecordList from './RecordList';
import RecordPlayer from './RecordPlayer';

export interface PlayData {
  title: string;
  url: string;
}

function Record() {
  const [nowPlaying, setIsNowPlaying] = useState<PlayData>({ title: '', url: '' });

  return (
    <div className="h-[calc(100vh-74px)] flex flex-row w-full gap-10">
      <>
        <div className="flex flex-col flex-grow gap-4 h-full ml-8">
          <RecordPlayer url={nowPlaying.url} />
          <RecordInfo title={nowPlaying.title} />
        </div>
        <div className="h-full w-80 pr-5">
          <RecordList onClickList={setIsNowPlaying} />
        </div>
      </>
    </div>
  );
}

export default Record;
