interface ErrorCharacterProps {
  size?: number;
  message?: string;
}

const ErrorCharacter = ({ size = 300, message = 'Error' }: ErrorCharacterProps): JSX.Element => {
  return (
    <div style={{ width: size, height: size }} className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Shadow */}
        <ellipse cx="100" cy="180" rx="65" ry="12" fill="#6366F1" opacity="0.2" />

        {/* Body */}
        <circle cx="100" cy="100" r="60" fill="#818CF8" />

        {/* Left Ear/Antenna */}
        <path d="M55 55 Q48 30 68 15" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <circle cx="68" cy="15" r="10" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>

        {/* Right Ear/Antenna */}
        <path d="M145 55 Q152 30 132 15" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <circle cx="132" cy="15" r="10" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>

        {/* Eyebrows */}
        <path d="M85 75 L95 80" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />
        <path d="M115 75 L105 80" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" />

        {/* Camera Lens/Eye */}
        <circle cx="100" cy="90" r="26" fill="#1E1B4B" />
        <circle cx="100" cy="90" r="21" fill="#312E81" />
        <circle cx="100" cy="90" r="16" fill="#1E1B4B" />
        <circle cx="94" cy="84" r="7" fill="white" opacity="0.7" />

        {/* Frowning Mouth */}
        <path d="M80 120 Q100 110 120 120" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />

        {/* Blush */}
        <circle cx="70" cy="110" r="10" fill="#EF4444" opacity="0.4" />
        <circle cx="130" cy="110" r="10" fill="#EF4444" opacity="0.4" />

        {/* Arms down */}
        <path d="M50 100 Q45 120 50 140" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <path d="M150 100 Q155 120 150 140" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />

        {/* Legs */}
        <path d="M80 160 L80 185" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <path d="M120 160 L120 185" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />

        {/* Warning Light */}
        <g transform="translate(100, 25)">
          {/* Error text */}
          <text
            x="0"
            y="-15"
            textAnchor="middle"
            fontFamily="Pretendard"
            fontSize="12"
            fontWeight="bold"
            fill="#EF4444"
          >
            Error!
          </text>

          {/* Light Effect */}
          <path d="M-14.4 0 A14.4 12 0 0 1 14.4 0 L14.4 15 L-14.4 15 Z" fill="#FEF2F2" opacity="0.2">
            <animate attributeName="opacity" values="0.2;0.1;0.2" dur="1.5s" repeatCount="indefinite" />
          </path>

          {/* Main Light Body */}
          <path d="M-12 0 A12 10 0 0 1 12 0 L12 12 L-12 12 Z" fill="#EF4444">
            <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
          </path>

          {/* Base */}
          <rect x="-18" y="12" width="36" height="8" rx="4" fill="#64748B" />
        </g>
      </svg>
      <p className="text-[#EF4444] font-bold mt-4">{message}</p>
    </div>
  );
};

export default ErrorCharacter;
