import Modal from '@components/Modal';
import { useNavigate } from 'react-router-dom';

interface ChatEndModalProps {
  setShowModal: (b: boolean) => void;
}

function ChatEndModal({ setShowModal }: ChatEndModalProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    setShowModal(false);
    navigate('/', { replace: true });
  };

  return (
    <Modal modalClassName="h-32 w-1/3" setShowModal={setShowModal}>
      <div className="flex flex-col items-center gap-3">
        <p className="text-text-strong text-display-medium16">방송이 종료되었습니다.</p>
        <button onClick={handleClick} className="underline">
          홈으로 이동하기
        </button>
      </div>
    </Modal>
  );
}

export default ChatEndModal;
