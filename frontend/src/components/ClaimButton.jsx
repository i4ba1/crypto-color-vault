export default function ClaimButton({
  color,
  loading,
  disabled,
  networkOk,
  account,
  myColor,
  isColorClaimed,
  onClaim,
}) {
  if (!account) {
    return (
      <p className="text-gray-500 text-sm text-center">
        Connect your wallet to claim a color
      </p>
    );
  }

  if (!networkOk) {
    return (
      <p className="text-yellow-500 text-sm text-center">
        Switch to Base Sepolia testnet to claim
      </p>
    );
  }

  if (myColor) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-16 h-16 rounded-lg border-2 border-green-500 shadow-lg"
          style={{ backgroundColor: myColor }}
        />
        <p className="text-green-400 text-sm">This is your claimed color</p>
      </div>
    );
  }

  const getButtonText = () => {
    if (loading) return "Claiming...";
    if (isColorClaimed) return "Already Claimed";
    if (color.length < 7) return "Pick a color first";
    return "Claim Color (0.001 ETH)";
  };

  const isDisabled = disabled || loading || isColorClaimed || color.length < 7;

  return (
    <button
      onClick={onClaim}
      disabled={isDisabled}
      className={`px-6 py-3 rounded-lg font-semibold text-lg transition-all ${
        isDisabled
          ? "bg-gray-700 text-gray-500 cursor-not-allowed"
          : "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/25"
      }`}
    >
      {getButtonText()}
    </button>
  );
}
