import { useState, useEffect } from "react";
import useWeb3 from "./hooks/useWeb3.js";
import Navbar from "./components/Navbar.jsx";
import ColorPicker from "./components/ColorPicker.jsx";
import ClaimButton from "./components/ClaimButton.jsx";
import ColorGrid from "./components/ColorGrid.jsx";
import TransactionToast from "./components/TransactionToast.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  const {
    account,
    networkOk,
    balance,
    myColor,
    allColors,
    loading,
    toast,
    setToast,
    hasMetaMask,
    connectWallet,
    switchNetwork,
    claimColor,
  } = useWeb3();

  const [selectedColor, setSelectedColor] = useState("#FF5733");

  const isColorClaimed = allColors.some(
    (item) => item.color === selectedColor
  );

  const handleClaim = () => {
    claimColor(selectedColor);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950">
      <Navbar
        account={account}
        balance={balance}
        networkOk={networkOk}
        hasMetaMask={hasMetaMask}
        connectWallet={connectWallet}
        switchNetwork={switchNetwork}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8 space-y-8">
        <section className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          <div className="flex-shrink-0">
            <ColorPicker
              color={selectedColor}
              onChange={setSelectedColor}
              disabled={!!myColor}
            />
          </div>

          <div className="flex flex-col items-center gap-4 flex-1">
            <ClaimButton
              color={selectedColor}
              loading={loading}
              disabled={loading}
              networkOk={networkOk}
              account={account}
              myColor={myColor}
              isColorClaimed={isColorClaimed}
              onClaim={handleClaim}
            />

            {!account && (
              <p className="text-gray-500 text-sm text-center max-w-md">
                Connect your MetaMask wallet to Base Sepolia testnet, pick a
                unique color, and claim it forever on the blockchain for just
                0.001 ETH.
              </p>
            )}

            {account && !myColor && !isColorClaimed && (
              <p className="text-gray-400 text-sm text-center">
                This color is available! Click the button above to claim it.
              </p>
            )}

            {account && !myColor && isColorClaimed && (
              <p className="text-red-400 text-sm text-center">
                Someone already owns this color. Pick another one!
              </p>
            )}

            {selectedColor && !isColorClaimed && (
              <div className="text-center">
                <p className="text-xs text-gray-500">Preview</p>
                <div
                  className="w-24 h-24 rounded-xl border-2 border-gray-600 shadow-lg mx-auto mt-1"
                  style={{ backgroundColor: selectedColor }}
                />
              </div>
            )}
          </div>
        </section>

        <section>
          <ColorGrid
            colors={allColors}
            myColor={myColor}
            account={account}
          />
        </section>
      </main>

      <Footer />

      <TransactionToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}
