interface RecordInfoProps {
  title: string;
}

function RecordInfo(props: RecordInfoProps) {
  return (
    <div className="flex flex-col h-1/5 gap-4 p-5">
      <h1 className="text-text-strong font-bold text-4xl">{props.title}</h1>
    </div>
  );
}

export default RecordInfo;
