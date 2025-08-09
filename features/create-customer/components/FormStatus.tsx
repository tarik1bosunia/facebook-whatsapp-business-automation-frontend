import { AlertCircle, CheckCircle2 } from "lucide-react";

type ApiError = {
  detail?: string;
};

// This function now ONLY looks for a top-level 'detail' message.
// All field-specific errors are handled by their respective components.
const getGeneralErrorMessage = (error: unknown): string | null => {
  if (!error) return null;

  const apiError = error as { data?: ApiError };
  if (apiError.data?.detail) {
    return apiError.data.detail;
  }

  // Fallback for non-API or unexpected errors
  if (error instanceof Error) {
    return error.message;
  }
  
  // Only show a generic message if no other error type is identified.
  const hasFieldErrors = error as { data?: { errors?: unknown } };
  if (!apiError.data && !hasFieldErrors.data?.errors) {
      return "An unexpected error occurred. Please try again.";
  }

  return null;
};

export default function FormStatus({
  isSuccess,
  isError,
  error,
}: {
  isSuccess: boolean;
  isError: boolean;
  error: unknown;
}) {
  const errorMessage = getGeneralErrorMessage(error);

  if (!isSuccess && !isError) return null;

  return (
    <div className="mb-4">
      {isSuccess && (
        <div className="flex items-center p-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <CheckCircle2 className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="font-medium">Success!</span> The new customer has been created.
        </div>
      )}
      {isError && errorMessage && (
        <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <AlertCircle className="flex-shrink-0 inline w-5 h-5 mr-3" />
          <span className="font-medium">Error:</span> {errorMessage}
        </div>
      )}
    </div>
  );
}
