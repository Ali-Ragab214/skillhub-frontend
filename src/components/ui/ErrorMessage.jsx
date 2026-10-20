export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-level-advanced/10 border border-level-advanced/20 rounded-lg p-6 max-w-md w-full text-center">
        <svg
          className="w-12 h-12 text-level-advanced mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p           className="text-level-advanced mb-4">{message || "Something went wrong"}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-level-advanced text-white rounded-lg hover:bg-level-advanced/80 transition-colors duration-150"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
