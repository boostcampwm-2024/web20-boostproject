import ErrorCharacter from '@components/ErrorCharacter';
import { useAuth } from '@hooks/useAuth';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function Auth() {
  const [searchParams] = useSearchParams();
  const { setLogIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const accessToken = searchParams.get('accessToken');
      const isNecessaryInfo = searchParams.get('isNecessaryInfo');
      if (!accessToken) {
        throw new Error('액세스 토큰을 받지 못했습니다.');
      }

      setLogIn(accessToken);
      if (isNecessaryInfo) navigate('/', { replace: true });
      else navigate('/profile', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('로그인 처리 중 오류'));
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {error ? (
        <ErrorCharacter size={400} message={error.message} />
      ) : (
        <div>
          <h2 className="text-display-bold24 text-text-strong">로그인 처리 중입니다.</h2>
          <p className="text-text-default text-display-medium16">잠시만 기다려주세요!!!!</p>
        </div>
      )}
    </div>
  );
}

export default Auth;
