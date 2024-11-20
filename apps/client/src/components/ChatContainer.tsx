import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import SmileIcon from './icons/SmileIcon';

interface Chat {
  camperId: string;
  name: string;
  message: string;
}

const sampleChat = [
  { camperId: 'J999', name: '김부캠', message: '안녕하세요' },
  { camperId: 'J999', name: '김부캠', message: '테스트 채팅입니당' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  {
    camperId: 'J999',
    name: '김부캠',
    message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ 어디까지 늘어나는거에요오오오옹ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',
  },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ 길게도 보내봐야지' },
  {
    camperId: 'J999',
    name: '김부캠',
    message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ 어디까지 늘어나는거에요오오오옹ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ',
  },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
  { camperId: 'J999', name: '김부캠', message: '테스트 원투원투 아ㅏ아ㅏ아아ㅏ' },
];

const ChatContainer = () => {
  const [chattings, setChattings] = useState<Chat[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
      setShouldAutoScroll(isAtBottom);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendChat = () => {
    if (inputValue.trim()) {
      setChattings(prev => [...prev, { camperId: 'J123', name: '부덕이', message: inputValue }]);
      setInputValue('');
    }
  };

  useEffect(() => {
    setChattings(sampleChat);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current && shouldAutoScroll) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chattings]);

  return (
    <Card className="h-full flex flex-col border-border-default bg-transparent shadow-none">
      <CardHeader>
        <CardTitle className="font-bold text-text-strong">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden px-6 pb-2">
        <ScrollArea className="h-full w-full pr-4" ref={scrollAreaRef} onScroll={handleScroll}>
          <div className="space-y-3">
            {chattings.map((chat, index) => (
              <div key={index}>
                <span className="font-medium text-display-medium16 text-text-weak">{chat.camperId} </span>
                <span className="font-medium text-display-medium14 text-text-strong">{chat.message}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full rounded-xl bg-surface-alt">
          <Input
            type="text"
            placeholder="채팅을 입력해주세요"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleSendChat();
              }
            }}
            className="flex-1 text-text-default border-none focus-visible:outline-none focus-visible:ring-0"
          />
          <button className="ml-2 p-2 rounded-full text-text-default">
            <SmileIcon />
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ChatContainer;
