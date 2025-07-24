"use client";

export const LoadingSpinner = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 via-purple-200 to-indigo-100"
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="flex flex-col items-center space-y-4">
        <svg
          className="animate-spin h-14 w-14 text-purple-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <p className="text-gray-700 font-semibold text-lg select-none">
          Loading your profile...
        </p>
      </div>
    </div>
  );
};
