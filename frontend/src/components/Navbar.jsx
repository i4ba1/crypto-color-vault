export default function Navbar({
  account,
  balance,
  networkOk,
  hasMetaMask,
  connectWallet,
  switchNetwork,
}) {
  const shortAddress = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : "";

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
        <h1 className="text-xl font-bold text-white">Crypto Color Vault</h1>
      </div>

      <div className="flex items-center gap-4">
        {!hasMetaMask ? (
          <span className="text-yellow-400 text-sm">
            Please install MetaMask to continue
          </span>
        ) : !account ? (
          <button
            onClick={connectWallet}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            {!networkOk && (
              <button
                onClick={switchNetwork}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg text-xs font-medium transition-colors"
              >
                Switch to Base Sepolia
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
              <span
                className={`w-2 h-2 rounded-full ${
                  networkOk ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-xs text-gray-300">
                {networkOk ? "Base Sepolia" : "Wrong Network"}
              </span>
            </div>

            <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300">
              {parseFloat(balance).toFixed(4)} ETH
            </div>

            <div className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm text-gray-300 font-mono">
              {shortAddress}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
