"use client";

import { useCreateCustomerForm } from "@/features/create-customer/hooks/use-create-customer-form";
import FormStatus from "@/features/create-customer/components/FormStatus";
import SubmitButton from "@/features/create-customer/components/SubmitButton";
import TextInput from "@/features/create-customer/components/TextInput";
import SearchableDropdown from "@/features/create-customer/components/SearchableDropdown";
import { FiUser, FiPhone, FiMapPin, FiHome, FiNavigation, FiFacebook, FiMessageSquare } from "react-icons/fi";

// Define a more specific type for the RTK Query error to avoid using 'any'
interface RtkQueryError {
  status: number;
  data: {
    errors?: Record<string, string[]>;
    social_media_ids?: string[];
  };
}

export default function CreateCustomerPage() {
  const {
    handleSubmit,
    formData,
    handleInputChange,
    isCreatingCustomer,
    isSuccess,
    isError,
    error,
    setShowFacebookDropdown,
    setShowWhatsappDropdown,
    getSelectedLabel,
    handleSocialMediaSelect,
    setFacebookSearch,
    setWhatsappSearch,
    showFacebookDropdown,
    showWhatsappDropdown,
    facebookOptions,
    whatsappOptions,
    facebookQuery,
    whatsappQuery,
    setFormData,
    facebookSearch,
    whatsappSearch,
  } = useCreateCustomerForm();

  // This is the definitive helper to get specific field errors.
  const getFieldError = (fieldName: string): string | undefined => {
    const typedError = error as RtkQueryError;
    if (typedError?.data?.errors && typedError.data.errors[fieldName]) {
      return typedError.data.errors[fieldName][0];
    }
    return undefined;
  };

  // This helper now correctly gets the social media error and checks which platform it's for.
  const getSocialMediaError = (platform: 'facebook' | 'whatsapp'): string | undefined => {
    const typedError = error as RtkQueryError;
    const socialErrors = typedError?.data?.social_media_ids;

    if (socialErrors && Array.isArray(socialErrors)) {
      const errorForPlatform = socialErrors.find(e => e.includes(`for platform '${platform}'`));
      if (errorForPlatform) {
        return errorForPlatform;
      }
    }
    
    const fieldError = getFieldError('social_media_ids');
    if (fieldError && fieldError.toLowerCase().includes(platform)) {
      return fieldError;
    }
    
    return undefined;
  };
  
    // Close dropdowns when clicking outside
    const handleClickOutside = (e: React.MouseEvent) => {
        if (!(e.target as HTMLElement).closest(".dropdown-container")) {
          setShowFacebookDropdown(false);
          setShowWhatsappDropdown(false);
        }
      };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" onClick={handleClickOutside}>
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

                {/* Social Media Section */}
                <div className="md:col-span-2 pt-4">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2 mb-4">
                        Social Media Accounts (Optional)
                    </h2>
                </div>
                <div className="md:col-span-2">
                    <SearchableDropdown
                        icon={<FiFacebook className="text-blue-600" />}
                        label="Facebook ID"
                        value={
                        formData.facebookId
                            ? getSelectedLabel(formData.facebookId, facebookOptions)
                            : facebookSearch
                        }
                        searchValue={facebookSearch}
                        onSearchChange={(value) => {
                        setFacebookSearch(value);
                        if (!showFacebookDropdown) setShowFacebookDropdown(true);
                        }}
                        onFocus={() => setShowFacebookDropdown(true)}
                        options={facebookOptions}
                        showDropdown={showFacebookDropdown}
                        isLoading={facebookQuery.isLoading || facebookQuery.isFetching}
                        onSelect={(value) => handleSocialMediaSelect("facebook", value)}
                        onClear={() => {
                        setFormData((prev) => ({ ...prev, facebookId: "" }));
                        setFacebookSearch("");
                        }}
                        hasSelection={!!formData.facebookId}
                        placeholder="Search Facebook ID"
                        error={getSocialMediaError('facebook')}
                    />
                </div>
                <div className="md:col-span-2">
                    <SearchableDropdown
                        icon={<FiMessageSquare className="text-green-600" />}
                        label="WhatsApp Number"
                        value={
                        formData.whatsappId
                            ? getSelectedLabel(formData.whatsappId, whatsappOptions)
                            : whatsappSearch
                        }
                        searchValue={whatsappSearch}
                        onSearchChange={(value) => {
                        setWhatsappSearch(value);
                        if (!showWhatsappDropdown) setShowWhatsappDropdown(true);
                        }}
                        onFocus={() => setShowWhatsappDropdown(true)}
                        options={whatsappOptions}
                        showDropdown={showWhatsappDropdown}
                        isLoading={whatsappQuery.isLoading || whatsappQuery.isFetching}
                        onSelect={(value) => handleSocialMediaSelect("whatsapp", value)}
                        onClear={() => {
                        setFormData((prev) => ({ ...prev, whatsappId: "" }));
                        setWhatsappSearch("");
                        }}
                        hasSelection={!!formData.whatsappId}
                        placeholder="Search WhatsApp number"
                        error={getSocialMediaError('whatsapp')}
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