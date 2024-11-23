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
