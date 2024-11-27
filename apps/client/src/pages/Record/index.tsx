import RecordInfo from './RecordInfo';
import RecordList from './RecordList';
import RecordPlayer from './RecordPlayer';

function Record() {
  return (
    <div className="h-[calc(100vh-74px)] flex flex-row w-full gap-10">
      <>
        <div className="flex flex-col flex-grow gap-4 h-full ml-8">
          <RecordPlayer />
          <RecordInfo />
        </div>
        <div className="h-full w-80 pr-5">
          <RecordList />
        </div>
      </>
    </div>
  );
}

export default Record;
