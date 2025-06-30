import { useState } from "react";

export default function FormStatus({
  isSuccess,
  isError,
  error,
}: {
  isSuccess: boolean;
  isError: boolean;
  error: unknown;
}) {
  const [showError, setShowError] = useState(true);

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    if (typeof error === "object" && error !== null) {
      if ("social_media_ids" in error) {
        return (error as any).social_media_ids as string;
      }
      return JSON.stringify(error, null, 2);
    }
    return "An unknown error occurred";
  };

  const errorMessage = isError ? getErrorMessage(error) : "";

  return (
    <>
      {isSuccess && (
        <div className="mb-4 p-3 text-green-800 bg-green-50 rounded-md border border-green-100 flex items-start animate-fade-in">
          <svg
            className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="font-medium">Customer created successfully!</h3>
            <p className="text-sm mt-1">
              The new customer has been added to your database.
            </p>
          </div>
        </div>
      )}

      {isError && showError && (
        <div className="relative mt-4 p-3 text-red-800 bg-red-50 rounded-md border border-red-100 flex items-start animate-fade-in">
          <svg
            className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-1"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>

          <div className="flex-1">
            <h3 className="font-medium">Error occurred</h3>
            <div className="text-sm mt-1 font-sans whitespace-pre-line max-h-32 overflow-y-auto pr-1">
              {errorMessage}
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowError(false)}
            className="absolute top-2 right-2 text-red-400 hover:text-red-600"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
