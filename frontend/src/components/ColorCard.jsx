import { useState } from "react";

export default function ColorCard({ color, owner, isMine }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const shortOwner = `${owner.slice(0, 6)}...${owner.slice(-4)}`;

  return (
    <div className="relative">
      <div
        className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer ${
          isMine ? "ring-2 ring-green-400 scale-105" : ""
        }`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
      >
        <div
          className="w-full aspect-square"
          style={{ backgroundColor: color }}
        />
        <div className="bg-gray-800 px-2 py-1.5">
          <p className="text-xs font-mono text-gray-300 text-center">{color}</p>
        </div>
      </div>

      {showTooltip && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 bg-gray-900 border border-gray-700 rounded-lg shadow-xl">
          <p className="text-xs text-gray-300 font-mono whitespace-nowrap">
            {isMine ? "You" : shortOwner}
          </p>
        </div>
      )}

      {isMine && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-3 h-3 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
