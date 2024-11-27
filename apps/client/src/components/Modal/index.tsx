import { CloseIcon } from '@components/Icons';
import { useEffect, useRef } from 'react';

interface ModalProps {
  children: React.ReactNode;
  setShowModal: (showModal: boolean) => void;
  modalClassName?: string;
}

function Modal({ children, setShowModal, modalClassName }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as HTMLElement)) {
        setShowModal(false);
      }
    };
    window.addEventListener('mousedown', handleClick);

    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  });
  return (
    <div className="fixed top-0 left-0 w-full h-full z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center">
      {/* 모달 */}
      <div
        className={`flex flex-col shadow-3xl bg-surface-default border-border-bold border-2 rounded ${modalClassName}`}
        ref={modalRef}
      >
        <div className="h-6 w-full flex justify-end p-2">
          <button
            className="float-right h-full cursor-pointer text-text-default hover:text-text-strong"
            onClick={() => setShowModal(false)}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
