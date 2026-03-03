import { coffeeRegions } from '../data/coffeeRegions';

function CoffeeMap({ triedCountries = [], onCountryClick }) {
  return (
    <div className="relative w-full aspect-[2/1] bg-cream-100 rounded-2xl overflow-hidden">
      {/* Simplified World Map SVG */}
      <svg
        viewBox="0 0 100 50"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background */}
        <rect x="0" y="0" width="100" height="50" fill="#f5f3f0" />

        {/* Simplified continent shapes */}
        {/* North America */}
        <path
          d="M5,8 Q15,5 25,10 L28,18 Q22,22 18,20 L12,22 Q8,18 5,15 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* Central America */}
        <path
          d="M18,22 L24,24 L26,28 L22,30 L18,26 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* South America */}
        <path
          d="M22,30 L30,32 Q35,40 32,48 L26,48 Q22,42 24,35 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* Europe */}
        <path
          d="M45,8 Q52,6 55,10 L58,14 Q54,18 48,16 L44,12 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* Africa */}
        <path
          d="M45,20 Q55,18 62,24 L64,35 Q60,45 52,45 L46,38 Q44,28 45,20 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* Asia */}
        <path
          d="M58,8 Q72,5 85,12 L88,22 Q82,28 75,26 L68,18 Q62,14 58,8 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* Southeast Asia / Indonesia */}
        <path
          d="M72,28 Q78,30 82,32 L85,38 Q80,42 75,38 L72,32 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* Australia */}
        <path
          d="M78,40 Q85,38 90,42 L88,48 Q82,50 78,46 Z"
          fill="#e8e5e0"
          stroke="#d4d0c8"
          strokeWidth="0.3"
        />

        {/* Coffee Belt indicator lines */}
        <line
          x1="0" y1="20" x2="100" y2="20"
          stroke="#a8b5a0"
          strokeWidth="0.15"
          strokeDasharray="1,1"
          opacity="0.5"
        />
        <line
          x1="0" y1="35" x2="100" y2="35"
          stroke="#a8b5a0"
          strokeWidth="0.15"
          strokeDasharray="1,1"
          opacity="0.5"
        />

        {/* Country markers */}
        {Object.entries(coffeeRegions).map(([name, region]) => {
          const isTried = triedCountries.includes(name);
          const isAvailable = region.origins.length > 0;
          const isComingSoon = region.comingSoon;

          return (
            <g
              key={region.id}
              className={isAvailable && !isComingSoon ? 'cursor-pointer' : ''}
              onClick={() => isAvailable && !isComingSoon && onCountryClick?.(name)}
            >
              {/* Pulse animation for tried countries */}
              {isTried && (
                <circle
                  cx={region.coordinates.x}
                  cy={region.coordinates.y}
                  r="3"
                  fill="none"
                  stroke="#6b8f71"
                  strokeWidth="0.3"
                  className="animate-ping"
                  style={{ transformOrigin: `${region.coordinates.x}px ${region.coordinates.y}px` }}
                />
              )}

              {/* Main marker */}
              <circle
                cx={region.coordinates.x}
                cy={region.coordinates.y}
                r={isTried ? 2.5 : 2}
                fill={isTried ? '#6b8f71' : isComingSoon ? '#d4d0c8' : '#b8c4b0'}
                stroke={isTried ? '#4a6b4f' : isComingSoon ? '#c4c0b8' : '#8fa088'}
                strokeWidth="0.4"
                className={isAvailable && !isComingSoon ? 'transition-all duration-300 hover:r-3' : ''}
              />

              {/* Checkmark for tried */}
              {isTried && (
                <path
                  d={`M${region.coordinates.x - 0.8},${region.coordinates.y} L${region.coordinates.x - 0.2},${region.coordinates.y + 0.6} L${region.coordinates.x + 0.8},${region.coordinates.y - 0.5}`}
                  fill="none"
                  stroke="white"
                  strokeWidth="0.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex items-center gap-3 text-[10px]">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sage-500" />
          <span className="text-charcoal-500">Tried</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-sage-200" />
          <span className="text-charcoal-500">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-charcoal-200" />
          <span className="text-charcoal-400">Coming Soon</span>
        </div>
      </div>

      {/* Coffee Belt Label */}
      <div className="absolute top-2 right-2 text-[9px] text-sage-600 bg-white/80 px-2 py-0.5 rounded-full">
        Coffee Belt
      </div>
    </div>
  );
}

export default CoffeeMap;
