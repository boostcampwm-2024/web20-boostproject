import { useState } from 'react';
import RecordInfo from './RecordInfo';
import RecordList from './RecordList';
import RecordPlayer from './RecordPlayer';

export interface RecordData {
  recordId: number;
  title: string;
  video: string;
  date: string;
}

function Record() {
  const [nowPlaying, setIsNowPlaying] = useState<RecordData>({ recordId: 0, title: '', video: '', date: '' });

  return (
    <div className="h-[calc(100vh-74px)] flex flex-row w-full gap-10">
      <>
        <div className="flex flex-col flex-grow gap-4 h-full ml-8">
          <RecordPlayer video={nowPlaying.video} />
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
