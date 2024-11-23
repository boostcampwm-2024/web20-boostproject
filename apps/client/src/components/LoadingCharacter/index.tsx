interface LoadingCharacterProps {
  size?: number;
}

const LoadingCharacter = ({ size = 300 }: LoadingCharacterProps): JSX.Element => {
  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/*-- Shadow */}
        <ellipse cx="100" cy="180" rx="65" ry="12" fill="#6366F1" opacity="0.2" />

        {/*-- Body */}
        <circle cx="100" cy="100" r="60" fill="#818CF8" />

        {/*-- Left Ear/Antenna */}
        <path d="M55 55 Q48 30 68 15" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <circle cx="68" cy="15" r="10" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>

        {/*-- Right Ear/Antenna */}
        <path d="M145 55 Q152 30 132 15" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <circle cx="132" cy="15" r="10" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>

        {/*-- Camera Lens/Eye */}
        <circle cx="100" cy="90" r="26" fill="#1E1B4B" />
        <circle cx="100" cy="90" r="21" fill="#312E81" />
        <circle cx="100" cy="90" r="16" fill="#1E1B4B" />
        <circle cx="94" cy="84" r="7" fill="white" opacity="0.7" />

        {/*-- Smile (static) */}
        <path d="M80 115 Q100 128 120 115" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />

        {/*-- Blush */}
        <circle cx="70" cy="110" r="10" fill="#FCA5A5" opacity="0.6" />
        <circle cx="130" cy="110" r="10" fill="#FCA5A5" opacity="0.6" />

        {/*-- Legs */}
        <path d="M80 160 L80 185" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <path d="M120 160 L120 185" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />

        {/*-- Arms holding display */}
        <path d="M50 100 Q40 120 50 140" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <path d="M150 100 Q160 120 150 140" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />

        {/*-- Display */}
        <rect x="50" y="130" width="100" height="60" rx="5" fill="white" />

        {/*-- Loading Spinner */}
        <g transform="translate(100 150)">
          <circle cx="0" cy="0" r="12" stroke="#818CF8" strokeWidth="3" fill="none" />
          <path d="M 12 0 A 12 12 0 0 1 -12 0" stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
        </g>

        {/*-- Loading Text */}
        <text
          x="100"
          y="175"
          textAnchor="middle"
          fontFamily="Pretendard"
          fontSize="14"
          fontWeight="bold"
          fill="#818CF8"
        >
          Loading
          <animate
            attributeName="text-content"
            values="Loading.;Loading..;Loading...;Loading...."
            dur="1.5s"
            repeatCount="indefinite"
          />
        </text>
      </svg>
    </div>
  );
};

export default LoadingCharacter;
