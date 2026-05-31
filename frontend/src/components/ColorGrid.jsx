import ColorCard from "./ColorCard.jsx";

export default function ColorGrid({ colors, myColor, account }) {
  if (colors.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
        <svg
          className="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-lg">No colors claimed yet. Be the first!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-300 mb-4">
        Claimed Colors ({colors.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {colors.map((item, index) => (
          <ColorCard
            key={`${item.color}-${index}`}
            color={item.color}
            owner={item.owner}
            isMine={item.color === myColor && item.owner === account}
          />
        ))}
      </div>
    </div>
  );
}
