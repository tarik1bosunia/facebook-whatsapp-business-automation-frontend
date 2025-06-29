import { FiSearch, FiX } from "react-icons/fi";
import { SocialMediaOption } from "../types";

interface SearchableDropdownProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFocus: () => void;
  options: SocialMediaOption[];
  showDropdown: boolean;
  isLoading: boolean;
  onSelect: (value: string) => void;
  onClear: () => void;
  hasSelection: boolean;
  placeholder: string;
}

export default function SearchableDropdown({
  icon,
  label,
  value,
  onSearchChange,
  onFocus,
  options,
  showDropdown,
  isLoading,
  onSelect,
  onClear,
  hasSelection,
  placeholder,
}: SearchableDropdownProps) {
  return (
    <div className="space-y-1 relative dropdown-container">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          type="text"
          value={value}
          onClick={onFocus}
          onChange={(e) => onSearchChange(e.target.value)}
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-text transition duration-150 ease-in-out"
          placeholder={placeholder}
          readOnly={hasSelection}
        />
        {hasSelection ? (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-500 transition-colors duration-150"
          >
            <FiX className="h-5 w-5 text-gray-400" />
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto transition-all duration-200 ease-in-out transform dropdown-container">
          {isLoading ? (
            <div className="px-4 py-3 text-gray-500 flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </div>
          ) : options.length > 0 ? (
            <>
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => onSelect(option.value)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center transition-colors duration-150 ease-in-out"
                >
                  {icon}
                  <span className="ml-2">{option.label}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 px-4 py-2 text-xs text-gray-500 bg-gray-50">
                {options.length} {options.length === 1 ? "result" : "results"}
              </div>
            </>
          ) : (
            <div className="px-4 py-3 text-gray-500">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
