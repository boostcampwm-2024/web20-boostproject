import { PlayIcon } from '@/components/Icons';

const recordList = [
  {
    title: '비디오111111111',
  },
  {
    title: '비디오222222',
  },
  {
    title: '비디오333333333333333',
  },
  {
    title: '비디오44444444444444444444444',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
  {
    title: '비디오5',
  },
];

function RecordList() {
  return (
    <div className="flex h-full w-full border border-border-default rounded p-5 overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        <div className="flex flex-col gap-6">
          {recordList.map((record, idx) => (
            <div
              key={idx}
              className="flex flex-row w-full h-12 justify-center items-center rounded gap-3 overflow-hidden bg-surface-alt"
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
