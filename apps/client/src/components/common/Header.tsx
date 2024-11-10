import { useState } from 'react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [isLogIn, setIsLogIn] = useState(true);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogInClick = () => {
    // TODO: 로그인 로직 구현
    alert('로그인 모달 창 구현 예정');
    setIsLogIn(true);
  };

  const handleLogOutClick = () => {
    // TODO: 로그아웃 로직 구현
    alert('로그아웃');
    setIsLogIn(false);
    navigate('/');
  };

  const handleCheckInClick = () => {
    // TODO: 방송 시작 구현
    setIsCheckedIn(prev => !prev);
    alert('체크인!');
  };

  return (
    <header className="px-10 py-6 flex justify-between">
      <div className="text-text-strong font-nabla text-4xl hover:cursor-pointer" onClick={handleLogoClick}>
        Cam'<span className="text-text-point">On</span>
      </div>
      {isLogIn ? (
        <div className="flex gap-2">
          <Button
            className={isCheckedIn && 'bg-surface-brand-default hover:bg-surface-brand-alt'}
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
    </header>
  );
}

export default Header;