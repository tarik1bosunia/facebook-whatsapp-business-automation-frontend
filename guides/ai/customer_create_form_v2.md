# V2: Redesigned Customer Creation Form

This guide contains the complete, updated code for the customer creation page and its related components. The new implementation fixes the JSON error display, shows field-specific validation errors, and features a more modern, responsive design.

---

## 1. `app/(protected)/customers/create/page.tsx` (Main Page Component)

This is the main page component with a responsive two-column layout and improved styling.

```tsx
"use client";

import { useCreateCustomerForm } from "@/features/create-customer/hooks/use-create-customer-form";
import FormStatus from "@/features/create-customer/components/FormStatus";
import SubmitButton from "@/features/create-customer/components/SubmitButton";
import TextInput from "@/features/create-customer/components/TextInput";
import { FiUser, FiPhone, FiMapPin, FiHome, FiNavigation } from "react-icons/fi";

export default function CreateCustomerPageV2() {
  const {
    handleSubmit,
    formData,
    handleInputChange,
    isCreatingCustomer,
    isSuccess,
    isError,
    error,
  } = useCreateCustomerForm();

  // Helper to get specific field errors
  const getFieldError = (fieldName: string): string | undefined => {
    if (error && typeof error === 'object' && 'errors' in error && error.errors) {
      const errors = error.errors as Record<string, string[]>;
      return errors[fieldName]?.[0];
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 p-6 rounded-t-xl">
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <FiUser className="mr-3 h-6 w-6" />
                  Create New Customer
                </h1>
                <p className="text-blue-100 mt-1">
                  Add a new customer to your database.
                </p>
              </div>

              {/* Form Content */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">
                    Personal Information
                  </h2>
                </div>
                <TextInput
                  icon={<FiUser />}
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., John Doe"
                  required
                  error={getFieldError("name")}
                />
                <TextInput
                  icon={<FiPhone />}
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g., +8801712345678"
                  required
                  error={getFieldError("phone")}
                />

                {/* Address Information */}
                <div className="md:col-span-2 pt-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">
                    Address Information
                  </h2>
                </div>
                <TextInput
                  icon={<FiMapPin />}
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., Dhaka"
                  required
                  error={getFieldError("city")}
                />
                <TextInput
                  icon={<FiHome />}
                  label="Police Station"
                  name="police_station"
                  value={formData.police_station}
                  onChange={handleInputChange}
                  placeholder="e.g., Gulshan"
                  required
                  error={getFieldError("police_station")}
                />
                <div className="md:col-span-2">
                  <TextInput
                    icon={<FiNavigation />}
                    label="Area / Street Address"
                    name="area"
                    value={formData.area || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., Banani, Road 11"
                    error={getFieldError("area")}
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="px-6 sm:px-8 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                <FormStatus
                  isSuccess={isSuccess}
                  isError={isError}
                  error={error}
                />
                <SubmitButton
                  isLoading={isCreatingCustomer}
                  label="Create Customer"
                  loadingLabel="Saving..."
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
```

---

## 2. `features/create-customer/components/FormStatus.tsx`

This component is updated to parse and display API validation errors correctly.

```tsx
import { AlertCircle, CheckCircle2 } from "lucide-react";

type ApiError = {
  detail?: string;
  errors?: Record<string, string[]>;
};

const getErrorMessage = (error: unknown): string | null => {
  if (!error) return null;

  const apiError = error as { data?: ApiError };
  if (apiError.data) {
    if (apiError.data.detail) {
      return apiError.data.detail;
    }
    // If there are field-specific errors, we don't show a general message,
    // as they will be displayed under each input field.
    if (apiError.data.errors && Object.keys(apiError.data.errors).length > 0) {
      return "Please correct the errors below.";
    }
  }

  if (error instanceof Error) return error.message;
  
  return "An unexpected error occurred. Please try again.";
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
  const errorMessage = getErrorMessage(error);

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
```

---

## 3. `features/create-customer/components/TextInput.tsx`

The `TextInput` component is enhanced to display a validation error message passed via props.

```tsx
import { AlertCircle } from "lucide-react";

interface TextInputProps {
  icon: React.ReactNode;
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  error?: string;
}

export default function TextInput({
  icon,
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
}: TextInputProps) {
  const hasError = !!error;
  const baseRingColor = "focus:ring-blue-500 dark:focus:ring-blue-400";
  const errorRingColor = "ring-red-500 dark:ring-red-400";
  const baseBorderColor = "border-gray-300 dark:border-gray-600";
  const errorBorderColor = "border-red-500 dark:border-red-400";

  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg leading-5 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-2 sm:text-sm transition duration-150 ease-in-out ${
            hasError ? `${errorBorderColor} ${errorRingColor}` : `${baseBorderColor} ${baseRingColor}`
          }`}
          placeholder={placeholder}
          required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
        />
      </div>
      {hasError && (
        <p id={`${name}-error`} className="flex items-center text-xs text-red-600 dark:text-red-400 mt-1">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          {error}
        </p>
      )}
    </div>
  );
}
