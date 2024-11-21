interface IconProps {
  size?: number;
  className?: string;
}

function Character({ size = 24, className = '' }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width={size} height={size} className={className}>
      <ellipse cx="24" cy="43.2" rx="15.6" ry="2.88" fill="#6366F1" opacity="0.2" />
      <circle cx="24" cy="24" r="14.4" fill="#818CF8" />
      <path d="M13.2 13.2 Q11.52 7.2 16.32 3.6" fill="none" stroke="#818CF8" strokeWidth="3.84" strokeLinecap="round" />
      <circle cx="16.32" cy="3.6" r="2.4" fill="#EF4444">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <path d="M34.8 13.2 Q36.48 7.2 31.68 3.6" fill="none" stroke="#818CF8" strokeWidth="3.84" strokeLinecap="round" />
      <circle cx="31.68" cy="3.6" r="2.4" fill="#EF4444">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="1s" />
      </circle>
      <circle cx="24" cy="21.6" r="6.24" fill="#1E1B4B" />
      <circle cx="24" cy="21.6" r="5.04" fill="#312E81" />
      <circle cx="24" cy="21.6" r="3.84" fill="#1E1B4B" />
      <circle cx="22.56" cy="20.16" r="1.68" fill="white" opacity="0.7" />
      <path d="M19.2 27.6 Q24 30.72 28.8 27.6" fill="none" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="16.8" cy="26.4" r="2.4" fill="#FCA5A5" opacity="0.6" />
      <circle cx="31.2" cy="26.4" r="2.4" fill="#FCA5A5" opacity="0.6" />
      <path d="M12 24 Q7.2 22.8 7.2 28.8" fill="none" stroke="#818CF8" strokeWidth="3.84" strokeLinecap="round" />
      <path d="M36 24 Q40.8 25.2 40.8 19.2" fill="none" stroke="#818CF8" strokeWidth="3.84" strokeLinecap="round" />
      <path d="M19.2 38.4 L19.2 44.4" fill="none" stroke="#818CF8" strokeWidth="3.84" strokeLinecap="round" />
      <path d="M28.8 38.4 L28.8 44.4" fill="none" stroke="#818CF8" strokeWidth="3.84" strokeLinecap="round" />
    </svg>
  );
}

export default Character;
