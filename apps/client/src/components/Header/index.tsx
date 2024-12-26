import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Character, Logo } from '@components/Icons';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { AuthContext } from '@/contexts/AuthContext';
import axiosInstance from '@/services/axios';
import { cn } from '@utils/utils';
import LogInButton from './LogInButton';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/useAuth';

function Header() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState('');
  const broadcastRef = useRef<Window | null>(null);
  const { isLoggedIn } = useContext(AuthContext);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
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

  const handleLogOutClick = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    axiosInstance.get('/v1/members/profile-image').then(response => {
      if (!response.data.success) return;
      setProfileImgUrl(response.data.data.profileImage);
    });
  }, [isLoggedIn]);

  return (
    <header className="fixed top-0 left-0 h-fit w-full px-10 py-3 flex justify-between z-10 bg-surface-default">
      <div className="flex flex-row gap-2 hover:cursor-pointer" onClick={handleLogoClick}>
        <Character size={48} />
        <Logo width={109} height={50} className="text-text-strong" />
      </div>
      <div className="flex items-center">
        {isLoggedIn ? (
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
            <Avatar
              onClick={() => {
                navigate('/profile');
              }}
              className="cursor-pointer h-10 w-10"
              aria-label="마이페이지로 이동"
            >
              <AvatarImage src={profileImgUrl} className="h-10 w-10" alt="마이페이지로 이동" />
              <AvatarFallback className="bg-surface-alt">MY</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <LogInButton />
        )}
      </div>
    </header>
  );
}

export default Header;
