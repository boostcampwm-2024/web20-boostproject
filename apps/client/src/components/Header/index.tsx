import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/utils';
import { Character, GithubIcon, GoogleIcon, Logo } from '@/components/Icons';
import { createPortal } from 'react-dom';
import Modal from '../Modal';
import WelcomeCharacter from '../WelcomeCharacter';

function Header() {
  const [isLogIn, setIsLogIn] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const broadcastRef = useRef<Window | null>(null);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogInClick = () => {
    // TODO: 로그인 로직 구현
    // alert('로그인 모달 창 구현 예정');
    // setIsLogIn(true);
    setShowModal(true);
  };

  const handleLogOutClick = () => {
    // TODO: 로그아웃 로직 구현
    alert('로그아웃');
    setIsLogIn(false);
    navigate('/');
  };

  const handleCheckInClick = () => {
    if (broadcastRef.current && !broadcastRef.current.closed) {
      broadcastRef.current.focus();
      return;
    }
    const newTapFeature = [
      `width=580`,
      `height=1024`,
      `bottom=0`,
      `right=0`,
      `resizable=yes`,
      `scrollbars=no`,
      'status=no',
      'location=no',
      'toolbar=no',
      'menubar=no',
    ].join(',');
    const broadcastUrl = `${window.location.origin}/broadcast`;
    const newWindow = window.open(broadcastUrl, '_blank', newTapFeature);

    if (newWindow) {
      setIsCheckedIn(true);
      broadcastRef.current = newWindow;

      newWindow.addEventListener('load', () => {
        newWindow.addEventListener('unload', () => {
          setIsCheckedIn(false);
          broadcastRef.current = null;
        });
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full px-10 py-3 flex justify-between z-10 bg-surface-default">
      <div className="flex flex-row gap-2 hover:cursor-pointer" onClick={handleLogoClick}>
        <Character size={48} />
        <Logo width={109} height={50} />
      </div>
      {isLogIn ? (
        <div className="flex gap-2 items-center">
          <Button
            className={cn({
              'bg-surface-brand-default hover:bg-surface-brand-alt': !isCheckedIn,
            })}
            onClick={handleCheckInClick}
          >
            체크인
          </Button>
          <Button onClick={handleLogOutClick}>로그아웃</Button>
        </div>
      ) : (
        <Button className="bg-surface-brand-default hover:bg-surface-brand-alt" onClick={handleLogInClick}>
          로그인
        </Button>
      )}
      {showModal &&
        createPortal(
          <Modal setShowModal={setShowModal}>
            <div className="flex flex-col flex-1">
              <div className="flex flex-row h-24 text-text-strong font-bold text-5xl items-center justify-center">
                WELCOME!
                <WelcomeCharacter size={80} />
              </div>
              <div className="flex flex-row md:flex-col flex-1 justify-around items-center gap-3 p-4">
                <button className="flex flex-row items-center h-16 w-15 md:w-4/5 border border-border-bold rounded-circle ">
                  <GithubIcon size={60} />
                  <span className="hidden flex-1 md:flex justify-center text-text-strong text-display-bold16 lg:text-display-bold24">
                    Gihub로 로그인하기
                  </span>
                </button>
                <button className="flex flex-row items-center h-16 w-15 md:w-4/5 border border-border-bold rounded-circle ">
                  <GoogleIcon />
                  <span className="hidden md:flex flex-1 justify-center text-text-strong text-display-bold16 lg:text-display-bold24">
                    Google로 로그인하기
                  </span>
                </button>
              </div>
            </div>
          </Modal>,
          document.body,
        )}
    </header>
  );
}

export default Header;
