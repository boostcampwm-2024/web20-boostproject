import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkDependencies = (functionName: string, dependencies: { [key: string]: any }) => {
  const missing = dependencies.keys(dependencies).filter((key: string) => !dependencies[key]);

  if (missing.length === 0) return null;
  return new Error(`${functionName} Error: ${missing.join(',')}이(가) 없습니다.`);
};

export const getCamperIdFromJWT = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return undefined;
  const base64Payload = token.split('.')[1];
  const base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');

  const decodedJWT = JSON.parse(
    decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    ),
  );
  return decodedJWT.camperId;
};
