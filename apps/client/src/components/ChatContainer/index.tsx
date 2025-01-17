import { useState, useEffect, useRef, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { SmileIcon } from '@/components/Icons';
import { useSocket } from '@hooks/useSocket';
import ErrorCharacter from '@components/ErrorCharacter';
import { AuthContext } from '@/contexts/AuthContext';
import { createPortal } from 'react-dom';
import ChatEndModal from './ChatEndModal';

interface Chat {
  camperId: string;
  name: string;
  message: string;
}

const chatServerUrl = import.meta.env.VITE_CHAT_SERVER_URL;

const ChatContainer = ({ roomId, isProducer }: { roomId: string; isProducer: boolean }) => {
  const { isLoggedIn } = useContext(AuthContext);
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
  // 채팅 종료
  const [showModal, setShowModal] = useState(false);

  const setUpRoom = async (isProducer: boolean) => {
    if (isProducer) {
      socket?.emit('createRoom', { roomId: roomId });
    } else {
      // 채팅방 입장
      socket?.emit('joinRoom', { roomId: roomId }, () => {});
      // 채팅방 종료 이벤트
      socket?.on('chatClosed', () => {
        setShowModal(true);
      });
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
      socket.emit('chat', { roomId: roomId, message: inputValue });
    }
    setInputValue('');
  };

  const handleReceiveChat = (response: Chat) => {
    const { camperId, name, message } = response;
    setChattings(prev => [...prev, { camperId, name, message }]);
  };

  const handleClickEmoticon = () => {
    alert('구현 예정');
  };

  useEffect(() => {
    if (!isConnected || !socket || !roomId || isJoinedRoom) return;
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
    <>
      <Card className="flex flex-col flex-1 border-border-default bg-transparent shadow-none overflow-hidden">
        <CardHeader className="h-[64px]">
          <CardTitle className="font-bold text-text-strong">Chat</CardTitle>
        </CardHeader>
        {socketError ? (
          <div className="flex justify-center items-center w-full h-full">
            <ErrorCharacter size={200} message={socketError.message} />
          </div>
        ) : (
          <>
            <CardContent ref={scrollAreaRef} className="flex flex-1 px-6 pb-2 overflow-y-auto flex-col-reverse">
              <div className="w-full flex flex-col space-y-1">
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
                  placeholder={isLoggedIn ? '채팅을 입력해주세요' : '로그인 후 이용해주세요'}
                  value={inputValue}
                  onChange={handleInputChange}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  onKeyDown={hanldeKeyDownEnter}
                  className="flex-1 text-text-default border-none focus-visible:outline-none focus-visible:ring-0"
                  disabled={!isLoggedIn}
                />
                <button
                  onClick={handleClickEmoticon}
                  className="ml-2 p-2 rounded-full text-text-default"
                  disabled={!isLoggedIn}
                >
                  <SmileIcon />
                </button>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
      {showModal && createPortal(<ChatEndModal setShowModal={setShowModal} />, document.body)}
    </>
  );
};

export default ChatContainer;
