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
