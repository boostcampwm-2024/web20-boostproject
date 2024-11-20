import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import SmileIcon from './icons/SmileIcon';
import { useSocket } from '@/hooks/useSocket';
import ErrorCharacter from './common/ErrorCharacter';

interface Chat {
  camperId: string;
  name: string;
  message: string;
}

const chatServerUrl = import.meta.env.VITE_CHAT_SERVER_URL;

const ChatContainer = ({ roomId, isProducer }: { roomId: string; isProducer: boolean }) => {
  // 채팅 전송
  const { socket, isConnected, socketError } = useSocket(chatServerUrl);
  const [chattings, setChattings] = useState<Chat[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  // 스크롤
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
    if (inputValue.trim() && socket) {
      socket.emit('chat', { roomId: roomId, message: inputValue }, (response: Chat) => {
        console.log('채팅 보내고 받은 응답:', response);
      });
    }
    setInputValue('');
  };

  const handleReceiveChat = (response: Chat) => {
    const { camperId, name, message } = response;
    setChattings(prev => [...prev, { camperId, name, message }]);
  };

  useEffect(() => {
    if (!isConnected || !roomId) return;

    socket?.on('chat', handleReceiveChat);

    if (isProducer) {
      console.log('채팅룸 생성할거임');
      socket?.emit(
        'createRoom',
        { name: '방송함', camperId: 'J111', roomId: roomId },
        (response: { roomId: string }) => {
          console.log(`채팅룸 생성 응답: ${JSON.stringify(response)}`);
          console.log(`채팅룸 생성: ${response.roomId}`);
        },
      );
    } else {
      // 채팅방 입장
      socket?.emit('joinRoom', { roomId: roomId, name: '김부캠', camperId: 'J999' }, () => {
        console.log('채팅방 입장');
      });
    }
    return () => {
      socket?.off('chat', handleReceiveChat);
    };
  }, [isConnected]);

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
      {socketError ? (
        <ErrorCharacter size={200} message={socketError.message} />
      ) : (
        <>
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
        </>
      )}
    </Card>
  );
};

export default ChatContainer;
