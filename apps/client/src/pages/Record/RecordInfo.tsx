const data = {
  title: '방송 녹화 화면~~~~~~',
  date: '2024.11.28',
};

function RecordInfo() {
  return (
    <div className="flex flex-col h-1/5 gap-4 p-5">
      <h1 className="text-text-strong font-bold text-4xl">{data.title}</h1>
      <span className="text-text-default font-medium text-display-medium16">{data.date}</span>
    </div>
  );
}

export default RecordInfo;
