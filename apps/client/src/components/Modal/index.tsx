import { CloseIcon } from '@components/Icons';
import { useEffect, useRef } from 'react';

interface ModalProps {
  children: React.ReactNode;
  setShowModal: (showModal: boolean) => void;
}

function Modal({ children, setShowModal }: ModalProps) {
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
        className="flex flex-col min-h-1/3 w-1/3 shadow-3xl bg-surface-default border-border-bold border-2 rounded p-2"
        ref={modalRef}
      >
        <div className="h-6 w-full clearfix mt-1 mr-2">
          <button
            className="float-right h-full cursor-pointer text-text-default hover:text-text-strong"
            onClick={() => setShowModal(false)}
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
