interface Props {
  size?: number;
  className?: string;
}

function WelcomeCharacter({ size, className }: Props) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width={size} height={size} className={className}>
      {/* Shadow */}
      <ellipse cx="100" cy="180" rx="65" ry="12" fill="#6366F1" opacity="0.2">
        <animate attributeName="opacity" values="0.2;0.15;0.2" dur="1s" repeatCount="indefinite" />
      </ellipse>

      {/* Body with bounce and float animation */}
      <g transform="translate(100 100)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="100,120;100,100;100,95;100,100"
          dur="0.5s"
          begin="0s"
          fill="freeze"
        />
        <animate
          attributeName="transform"
          type="translate"
          values="100,100;100,98;100,100"
          dur="2s"
          begin="0.5s"
          repeatCount="indefinite"
        />
        <circle cx="0" cy="0" r="60" fill="#818CF8" />
      </g>

      {/*} Left Ear/Antenna */}
      <g transform="translate(0 0)">
        <path d="M55 55 Q48 30 68 15" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <circle cx="68" cy="15" r="10" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Right Ear/Antenna */}
      <g transform="translate(0 0)">
        <path d="M145 55 Q152 30 132 15" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
        <circle cx="132" cy="15" r="10" fill="#EF4444">
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="1s" />
        </circle>
      </g>

      {/* Camera Lens/Eye with sparkle */}
      <g transform="translate(100 90)">
        <circle r="26" fill="#1E1B4B" />
        <circle r="21" fill="#312E81" />
        <circle r="16" fill="#1E1B4B" />
        {/* Sparkle effect */}
        <circle cx="-6" cy="-6" r="7" fill="white" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="1s" repeatCount="indefinite" />
          <animate attributeName="r" values="7;6;7" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>

      {/*} Happy Smile */}
      <path d="M80 115 Q100 128 120 115" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round">
        <animate
          attributeName="d"
          values="M80 115 Q100 128 120 115;M80 112 Q100 130 120 112;M80 115 Q100 128 120 115"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      {/* Blush with pulse */}
      <circle cx="70" cy="110" r="10" fill="#FCA5A5">
        <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="130" cy="110" r="10" fill="#FCA5A5">
        <animate attributeName="opacity" values="0.6;0.8;0.6" dur="2s" repeatCount="indefinite" />
      </circle>

      {/* Waving Arms */}
      <g transform="translate(50 100)">
        <path d="M0 0 Q-20 -10 -30 -20" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 0;-20 0 0;0 0 0"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      <g transform="translate(150 100)">
        <path d="M0 0 Q20 -10 30 -20" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 0 0;20 0 0;0 0 0"
            dur="1s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </path>
      </g>

      {/* Legs */}
      <path d="M80 160 L80 185" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
      <path d="M120 160 L120 185" fill="none" stroke="#818CF8" strokeWidth="16" strokeLinecap="round" />
    </svg>
  );
}
export default WelcomeCharacter;
