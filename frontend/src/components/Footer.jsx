import { CONTRACT_ADDRESS } from "../utils/contract.js";

export default function Footer() {
  return (
    <footer className="px-6 py-6 border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
        <p>
          Contract:{" "}
          {CONTRACT_ADDRESS ? (
            <a
              href={`https://sepolia.basescan.org/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:underline font-mono"
            >
              {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
            </a>
          ) : (
            <span className="text-gray-600">Not deployed</span>
          )}
        </p>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
