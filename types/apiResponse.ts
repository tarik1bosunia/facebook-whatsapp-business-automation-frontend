// A single error message item (converted from DRF's ErrorDetail)
export type ErrorDetailItem = string | number | boolean | null;

// DRF sometimes returns errors as simple strings (which we convert to arrays)
export type ErrorDetail = ErrorDetailItem | ErrorDetailItem[];

// Handles nested error structures (for nested serializers)
export interface NestedErrors {
  [key: string]: ErrorDetail | NestedErrors;
}

// Field-level errors in DRF format (before our custom renderer processes them)
export type DRFRawErrors = {
  [key: string]: ErrorDetail | NestedErrors;
} & {
  non_field_errors?: ErrorDetail;
};

// Processed error response from CustomRenderer
export interface ErrorResponse {
  errors: {
    [key: string]: ErrorDetailItem[] | NestedErrors;
  } & {
    non_field_errors?: ErrorDetailItem[];
    detail?: ErrorDetailItem[];  // For DRF's default error format
  };
}

// A generic wrapper for any API response
export type ApiResponse<T = unknown> = T | ErrorResponse;

// Enhanced type guard with stricter checks
export function isErrorResponse(response: unknown): response is ErrorResponse {
  if (typeof response !== 'object' || response === null) return false;
  
  const r = response as Record<string, unknown>;
  if (!('errors' in r)) return false;
  
  const errors = r.errors;
  return (
    typeof errors === 'object' && 
    errors !== null &&
    !Array.isArray(errors) &&
    Object.values(errors).every(val => 
      Array.isArray(val) ||  // Field errors as arrays
      (typeof val === 'object' && val !== null)  // Nested errors
    )
  );
}

// Helper type for field errors in forms
export type FieldErrorMap = Record<string, string[]>;