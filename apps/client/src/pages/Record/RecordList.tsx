import { PlayIcon } from '@/components/Icons';
import { PlayData } from '.';
import { useEffect, useState } from 'react';

const temp = [
  {
    title: '비디오111111111',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오222222',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오333333333333333',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오44444444444444444444444',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오6',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오7',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오8',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오9',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오10',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오11',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오12',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오13',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오14',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오15',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오16',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오17',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오18',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오19',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오20',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오21',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오22',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오23',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
  {
    title: '비디오24',
    url: 'https://camon.kr.object.ncloudstorage.com/records/51bd4877-9df6-4028-bfa1-75f0765e3c4e/51bd4877-9df6-4028-bfa1-75f0765e3c4e.m3u8',
  },
];

interface RecordListProps {
  onClickList: (data: PlayData) => void;
}

function RecordList(props: RecordListProps) {
  const [recordList, setRecordList] = useState<PlayData[]>([]);

  useEffect(() => {
    // TODO: 레코드 조회 API 요청
    setRecordList(temp);
  }, []);

  return (
    <div className="flex h-full w-full border border-border-default rounded p-5 overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-6">
          {recordList.map((record: PlayData, idx: number) => (
            <div
              key={idx}
              className="flex flex-row w-full h-12 justify-center items-center rounded gap-3 overflow-hidden bg-surface-alt cursor-pointer"
              onClick={() => props.onClickList({ title: record.title, url: record.url })}
            >
              <PlayIcon />
              <p className="w-4/5 text-text-default text-display-medium16 truncate">{record.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecordList;
