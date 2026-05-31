export default function TransactionToast({ toast, onDismiss }) {
  if (!toast) return null;

  const basePath = "https://sepolia.basescan.org";

  const config = {
    pending: {
      bg: "bg-blue-900/80 border-blue-500",
      icon: (
        <svg className="animate-spin w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
    },
    success: {
      bg: "bg-green-900/80 border-green-500",
      icon: (
        <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    error: {
      bg: "bg-red-900/80 border-red-500",
      icon: (
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    },
  };

  const { bg, icon } = config[toast.type] || config.error;

  const txHashMatch = toast.message.match(/0x[a-fA-F0-9]{64}/);
  const txHash = txHashMatch ? txHashMatch[0] : null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in">
      <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border ${bg} shadow-2xl`}>
        {icon}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white break-words">{toast.message}</p>
          {txHash && (
            <a
              href={`${basePath}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline mt-1 inline-block"
            >
              View on Basescan
            </a>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-white transition-colors shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
