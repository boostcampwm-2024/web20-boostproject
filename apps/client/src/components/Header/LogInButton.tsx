import { useState } from 'react';
import WelcomeCharacter from '@components/WelcomeCharacter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@components/ui/button';
import { createPortal } from 'react-dom';
import Modal from '@components/Modal';
import { GithubIcon, GoogleIcon } from '@components/Icons';

function LogInButton() {
  const [showModal, setShowModal] = useState(false);
  const { requestLogIn } = useAuth();

  const handleLogInClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <Button className="bg-surface-brand-default hover:bg-surface-brand-alt" onClick={handleLogInClick}>
        로그인
      </Button>
      {showModal &&
        createPortal(
          <Modal setShowModal={setShowModal} modalClassName="h-80 w-1/3">
            <div className="flex flex-col flex-1">
              <div className="flex flex-row h-24 text-text-strong font-bold text-3xl md:text-5xl items-center justify-center px-5">
                WELCOME!
                <WelcomeCharacter size={80} />
              </div>
              <div className="flex flex-row md:flex-col h-full justify-around items-center gap-3 p-4">
                <button
                  onClick={() => {
                    requestLogIn('github');
                  }}
                  className="flex flex-row items-center h-16 w-15 md:w-4/5 border border-border-bold rounded-circle "
                >
                  <GithubIcon size={60} />
                  <span className="hidden flex-1 md:flex justify-center text-text-strong text-display-bold16 lg:text-display-bold24 px-5">
                    Gihub로 로그인하기
                  </span>
                </button>
                <button
                  onClick={() => {
                    requestLogIn('google');
                  }}
                  className="flex flex-row items-center h-16 w-15 md:w-4/5 border border-border-bold rounded-circle "
                >
                  <GoogleIcon />
                  <span className="hidden md:flex flex-1 justify-center text-text-strong text-display-bold16 lg:text-display-bold24 px-5">
                    Google로 로그인하기
                  </span>
                </button>
                <button className="border-none">게스트로 로그인하기</button>
              </div>
            </div>
          </Modal>,
          document.body,
        )}
    </>
  );
}

export default LogInButton;
