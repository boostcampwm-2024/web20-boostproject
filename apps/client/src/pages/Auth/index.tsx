import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setLogIn } = useAuth();

  const handleCallback = async () => {
    const accessToken = searchParams.get('accessToken');
    if (!accessToken) throw new Error('액세스 토큰을 받지 못했습니다.');

    setLogIn(accessToken);
    navigate('/');
  };

  useEffect(() => {
    handleCallback();
  }, [searchParams]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div>
        <h2 className="text-display-bold24 text-text-strong">로그인 처리 중입니다.</h2>
        <p className="text-text-default text-display-medium16">잠시만 기다려주세요!!!!</p>
      </div>
    </div>
  );
}

export default Auth;
