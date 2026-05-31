import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/contract.js";

const BASE_SEPOLIA_CHAIN_ID = "0x14a34"; // 84532 in hex

export default function useWeb3() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [networkOk, setNetworkOk] = useState(false);
  const [balance, setBalance] = useState("0");
  const [myColor, setMyColor] = useState(null);
  const [allColors, setAllColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [toast, setToast] = useState(null); // { type, message }

  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum;

  const checkNetwork = useCallback(async () => {
    if (!hasMetaMask) return;
    try {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      setNetworkOk(chainId === BASE_SEPOLIA_CHAIN_ID);
    } catch {
      setNetworkOk(false);
    }
  }, [hasMetaMask]);

  const switchNetwork = useCallback(async () => {
    if (!hasMetaMask) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BASE_SEPOLIA_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: BASE_SEPOLIA_CHAIN_ID,
                chainName: "Base Sepolia Testnet",
                nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                rpcUrls: ["https://sepolia.base.org"],
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          });
        } catch {
          // user rejected
        }
      }
    }
  }, [hasMetaMask]);

  const connectWallet = useCallback(async () => {
    if (!hasMetaMask) return;
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      await checkNetwork();
    } catch {
      // user rejected
    }
  }, [hasMetaMask, checkNetwork]);

  const loadBalance = useCallback(async () => {
    if (!provider || !account) return;
    try {
      const bal = await provider.getBalance(account);
      setBalance(ethers.formatEther(bal));
    } catch {
      // ignore
    }
  }, [provider, account]);

  const loadColors = useCallback(async () => {
    if (!contract) return;
    try {
      const [colors, owners] = await contract.getAllColorsWithOwners();
      const mapped = colors.map((color, i) => ({
        color,
        owner: owners[i],
      }));
      setAllColors(mapped);
    } catch {
      // ignore
    }
  }, [contract]);

  const loadMyColor = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const color = await contract.getMyColor();
      setMyColor(color || null);
    } catch {
      // ignore
    }
  }, [contract, account]);

  const claimColor = useCallback(
    async (colorHex) => {
      if (!contract || !signer) return;
      setLoading(true);
      setToast(null);
      try {
        const tx = await contract.claimColor(colorHex, {
          value: ethers.parseEther("0.001"),
        });
        setTxHash(tx.hash);
        setToast({ type: "pending", message: `Transaction submitted: ${tx.hash}` });

        const receipt = await tx.wait(1);
        setToast({
          type: "success",
          message: `Color claimed! Tx: ${receipt.hash}`,
        });
        await loadColors();
        await loadMyColor();
        await loadBalance();
      } catch (err) {
        if (err.code === 4001 || err.code === "ACTION_REJECTED") {
          setToast({ type: "error", message: "You cancelled the transaction" });
        } else {
          setToast({
            type: "error",
            message: err.reason || err.message || "Transaction failed",
          });
        }
      } finally {
        setLoading(false);
      }
    },
    [contract, signer, loadColors, loadMyColor, loadBalance]
  );

  // Initialize provider and contract when account changes
  useEffect(() => {
    if (!account || !hasMetaMask) {
      setProvider(null);
      setSigner(null);
      setContract(null);
      return;
    }

    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    setProvider(ethersProvider);

    ethersProvider.getSigner().then((s) => {
      setSigner(s);
      setContract(getContract(s));
    });
  }, [account, hasMetaMask]);

  // Set up read-only contract for view calls when no account
  useEffect(() => {
    if (account || !hasMetaMask) return;
    const ethersProvider = new ethers.BrowserProvider(window.ethereum);
    setContract(getContract(ethersProvider));
  }, [account, hasMetaMask]);

  // Load colors when contract is ready
  useEffect(() => {
    if (contract) {
      loadColors();
    }
  }, [contract, loadColors]);

  // Load balance when account/provider change
  useEffect(() => {
    if (account && provider) {
      loadBalance();
    }
  }, [account, provider, loadBalance]);

  // Load my color when account/contract change
  useEffect(() => {
    if (account && contract) {
      loadMyColor();
    }
  }, [account, contract, loadMyColor]);

  // MetaMask event listeners
  useEffect(() => {
    if (!hasMetaMask) return;

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
      setMyColor(null);
      setBalance("0");
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [hasMetaMask]);

  // Real-time event listener for ColorClaimed
  useEffect(() => {
    if (!contract) return;

    const onColorClaimed = (claimant, colorHex) => {
      setAllColors((prev) => [...prev, { color: colorHex, owner: claimant }]);
    };

    contract.on("ColorClaimed", onColorClaimed);
    return () => {
      contract.off("ColorClaimed", onColorClaimed);
    };
  }, [contract]);

  return {
    account,
    provider,
    contract,
    signer,
    networkOk,
    balance,
    myColor,
    allColors,
    loading,
    txHash,
    toast,
    setToast,
    hasMetaMask,
    connectWallet,
    switchNetwork,
    checkNetwork,
    claimColor,
    loadColors,
    loadBalance,
  };
}
