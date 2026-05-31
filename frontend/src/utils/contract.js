import { ethers } from "ethers";

const CONTRACT_ABI = [
  "function claimFee() view returns (uint256)",
  "function colorOwner(string) view returns (address)",
  "function ownerColor(address) view returns (string)",
  "function allColors(uint256) view returns (string)",
  "function claimColor(string memory _colorHex) payable",
  "function getColorOwner(string memory _colorHex) view returns (address)",
  "function getMyColor() view returns (string)",
  "function getAllColors() view returns (string[])",
  "function getAllColorsWithOwners() view returns (string[], address[])",
  "function withdrawFees()",
  "function updateFee(uint256 _newFee)",
  "event ColorClaimed(address indexed claimant, string colorHex, uint256 fee)",
];

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "";

export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export { CONTRACT_ADDRESS };
