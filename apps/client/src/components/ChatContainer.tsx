import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  // 채팅 방 입장
  const [isJoinedRoom, setIsJoinedRoom] = useState(false);
  // 채팅 전송
  const { socket, isConnected, socketError } = useSocket(chatServerUrl);
  const [chattings, setChattings] = useState<Chat[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isComposing, setIsComposing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  // 스크롤
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  const setUpRoom = async (isProducer: boolean) => {
    try {
      if (isProducer) {
        console.log('채팅룸 생성할거임');
        await new Promise(resolve =>
          socket?.emit(
            'createRoom',
            { name: '방송함', camperId: 'J111', roomId: roomId },
            (response: { roomId: string }) => {
              console.log(`채팅룸 생성 응답: ${JSON.stringify(response)}`);
              console.log(`채팅룸 생성: ${response.roomId}`);
              resolve;
            },
          ),
        );
      } else {
        // 채팅방 입장
        await new Promise(resolve =>
          socket?.emit('joinRoom', { roomId: roomId, name: '김부캠', camperId: 'J999' }, () => {
            console.log('채팅방 입장');
            resolve;
          }),
        );
      }
    } catch (err) {
      console.error(`방 생성/입장 실패: ${err}`);
    }
    setIsJoinedRoom(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const hanldeKeyDownEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposing) return;
    if (e.key === 'Enter') {
      handleSendChat();
    }
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
    if (!isConnected || !socket || !roomId || isJoinedRoom) return;
    console.log(`roomId: ${JSON.stringify(roomId)}`);
    setUpRoom(isProducer);

    socket?.on('chat', handleReceiveChat);

    return () => {
      socket?.off('chat', handleReceiveChat);
    };
  }, [isConnected, roomId, socket]);

  // 자동 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [chattings]);

  return (
    <Card className="flex flex-col flex-1 border-border-default bg-transparent shadow-none overflow-hidden">
      <CardHeader className="h-[64px]">
        <CardTitle className="font-bold text-text-strong">Chat</CardTitle>
      </CardHeader>
      {socketError ? (
        <div className="flex justify-center items-center">
          <ErrorCharacter size={200} message={socketError.message} />
        </div>
      ) : (
        <>
          <CardContent ref={scrollAreaRef} className="flex flex-1 px-6 pb-2 justify-end overflow-y-auto">
            <div className="w-full pr-4 flex flex-col space-y-3 ">
              {chattings.map((chat, index) => (
                <div key={index}>
                  <span className="font-medium text-display-medium16 text-text-weak">{chat.camperId} </span>
                  <span className="font-medium text-display-medium14 text-text-strong">{chat.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="h-[64px]">
            <div className="flex items-center w-full rounded-xl bg-surface-alt">
              <Input
                type="text"
                placeholder="채팅을 입력해주세요"
                value={inputValue}
                onChange={handleInputChange}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onKeyDown={hanldeKeyDownEnter}
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
