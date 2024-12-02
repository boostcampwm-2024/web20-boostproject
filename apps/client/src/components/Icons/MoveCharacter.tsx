function MoveCharacter() {
  return (
    <svg width="200" height="250" viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 30)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0,30; 0,0; 0,30"
          dur="0.8s"
          repeatCount="indefinite"
          keyTimes="0; 0.5; 1"
          keySplines="0.5 0 0.5 1; 0.5 0 0.5 1"
          calcMode="spline"
        />

        <path opacity="0.2" fill="#6366F1">
          <animate
            attributeName="d"
            dur="0.8s"
            repeatCount="indefinite"
            values="M100 192C135.899 192 165 186.627 165 180C165 173.373 135.899 168 100 168C64.1015 168 35 173.373 35 180C35 186.627 64.1015 192 100 192Z;
                      M100 192C120 192 140 189 140 185C140 181 120 178 100 178C80 178 60 181 60 185C60 189 80 192 100 192Z;
                      M100 192C135.899 192 165 186.627 165 180C165 173.373 135.899 168 100 168C64.1015 168 35 173.373 35 180C35 186.627 64.1015 192 100 192Z"
            keyTimes="0; 0.5; 1"
          />
        </path>

        <circle cx="100" cy="100" r="60" fill="#818CF8">
          <animate attributeName="cy" dur="0.4s" repeatCount="indefinite" values="100;97;100" />
        </circle>

        <path stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
          <animate
            attributeName="d"
            dur="0.8s"
            repeatCount="indefinite"
            values="M50 100C36.6667 103.333 30 96.6667 30 80;
                      M50 100C36.6667 97.333 30 90.6667 30 74;
                      M50 100C36.6667 103.333 30 96.6667 30 80"
          />
        </path>

        <path stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
          <animate
            attributeName="d"
            dur="0.8s"
            repeatCount="indefinite"
            values="M150 100C163.333 103.333 170 96.6667 170 80;
                      M150 100C163.333 97.333 170 90.6667 170 74;
                      M150 100C163.333 103.333 170 96.6667 170 80"
          />
        </path>

        <g>
          <g>
            <path d="M55 55C50.3333 38.3333 54.6667 25 68 15" stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
              <animate
                attributeName="d"
                dur="0.8s"
                repeatCount="indefinite"
                values="M55 55C50.3333 38.3333 54.6667 25 68 15;
                          M52 52C47.3333 35.3333 51.6667 22 65 12;
                          M55 55C50.3333 38.3333 54.6667 25 68 15"
              />
            </path>
            <circle cx="68" cy="15" r="10" fill="#EF4444">
              <animate attributeName="cy" dur="0.8s" repeatCount="indefinite" values="15;12;15" />
              <animate attributeName="cx" dur="0.8s" repeatCount="indefinite" values="68;65;68" />
              <animate attributeName="opacity" dur="1s" values="1;0.7;1" repeatCount="indefinite" />
            </circle>
          </g>

          <g>
            <path d="M145 55C149.667 38.3333 145.333 25 132 15" stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
              <animate
                attributeName="d"
                dur="0.8s"
                repeatCount="indefinite"
                values="M145 55C149.667 38.3333 145.333 25 132 15;
                          M148 52C152.667 35.3333 148.333 22 135 12;
                          M145 55C149.667 38.3333 145.333 25 132 15"
              />
            </path>
            <circle cx="132" cy="15" r="10" fill="#EF4444">
              <animate attributeName="cy" dur="0.8s" repeatCount="indefinite" values="15;12;15" />
              <animate attributeName="cx" dur="0.8s" repeatCount="indefinite" values="132;135;132" />
              <animate attributeName="opacity" dur="1s" values="0.7;1;0.7" repeatCount="indefinite" />
            </circle>
          </g>

          <path
            d="M100 116C114.359 116 126 104.359 126 90C126 75.6406 114.359 64 100 64C85.6406 64 74 75.6406 74 90C74 104.359 85.6406 116 100 116Z"
            fill="#1E1B4B"
          />
          <path
            d="M100 111C111.598 111 121 101.598 121 90C121 78.402 111.598 69 100 69C88.402 69 79 78.402 79 90C79 101.598 88.402 111 100 111Z"
            fill="#312E81"
          />
          <path
            d="M100 106C108.837 106 116 98.8366 116 90C116 81.1634 108.837 74 100 74C91.1634 74 84 81.1634 84 90C84 98.8366 91.1634 106 100 106Z"
            fill="#1E1B4B"
          />
          <path
            opacity="0.7"
            d="M94 91C97.866 91 101 87.866 101 84C101 80.134 97.866 77 94 77C90.134 77 87 80.134 87 84C87 87.866 90.134 91 94 91Z"
            fill="white"
          />
          <path
            d="M80 115C93.3333 123.667 106.667 123.667 120 115"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            opacity="0.6"
            d="M70 120C75.5228 120 80 115.523 80 110C80 104.477 75.5228 100 70 100C64.4772 100 60 104.477 60 110C60 115.523 64.4772 120 70 120Z"
            fill="#FCA5A5"
          />
          <path
            opacity="0.6"
            d="M130 120C135.523 120 140 115.523 140 110C140 104.477 135.523 100 130 100C124.477 100 120 104.477 120 110C120 115.523 124.477 120 130 120Z"
            fill="#FCA5A5"
          />
        </g>

        <path stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
          <animate attributeName="d" dur="0.8s" repeatCount="indefinite" values="M80 160V185;M80 160V175;M80 160V185" />
        </path>
        <path stroke="#818CF8" strokeWidth="16" strokeLinecap="round">
          <animate
            attributeName="d"
            dur="0.8s"
            repeatCount="indefinite"
            values="M120 160V185;M120 160V175;M120 160V185"
          />
        </path>
      </g>
    </svg>
  );
}

export default MoveCharacter;
