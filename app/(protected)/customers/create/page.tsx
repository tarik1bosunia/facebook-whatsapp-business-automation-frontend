"use client";

import FormStatus from "@/features/create-customer/components/FormStatus";
import SearchableDropdown from "@/features/create-customer/components/SearchableDropdown";
import SubmitButton from "@/features/create-customer/components/SubmitButton";
import TextInput from "@/features/create-customer/components/TextInput";
import { useCreateCustomerForm } from "@/features/create-customer/hooks/use-create-customer-form";
import { FiFacebook, FiMessageSquare, FiPhone, FiUser } from "react-icons/fi";

export default function CreateCustomerPage() {
  const {
    handleSubmit,
    setShowFacebookDropdown,
    setShowWhatsappDropdown,
    formData,
    handleInputChange,
    getSelectedLabel,
    handleSocialMediaSelect,
    setFacebookSearch,
    setWhatsappSearch,
    showFacebookDropdown,
    showWhatsappDropdown,
    facebookOptions,
    whatsappOptions,
    isCreatingCustomer,
    isSuccess,
    isError,
    error,
    facebookQuery,
    whatsappQuery,
    setFormData,
    facebookSearch,
    whatsappSearch,
  } = useCreateCustomerForm();

  // Close dropdowns when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest(".dropdown-container")) {
      setShowFacebookDropdown(false);
      setShowWhatsappDropdown(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8"
      onClick={handleClickOutside}
    >
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-center">
          <div className="w-full max-w-md">
            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <FiUser className="mr-2" />
                  Create New Customer
                </h2>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Personal Information
                  </h3>

                  <TextInput
                    icon={<FiUser />}
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />


                  <TextInput
                    icon={<FiPhone />}
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+8801712345678"
                    required
                  />
                  <TextInput
                    icon={<FiUser />}
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Dhaka"
                    required
                  />
                  <TextInput
                    icon={<FiUser />}
                    label="Police Station"
                    name="police_station"
                    value={formData.police_station}
                    onChange={handleInputChange}
                    placeholder="Gulshan"
                    required
                  />
                  <TextInput
                    icon={<FiUser />}
                    label="Area"
                    name="area"
                    value={formData.area || ''}
                    onChange={handleInputChange}
                    placeholder="Banani"
                  />
                </div>

                {/* Social Media Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Social Media Accounts
                  </h3>

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
                  />

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
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-4">
                                    
                  <FormStatus
                    isSuccess={isSuccess}
                    isError={isError}
                    error={error}
                  />
                  <SubmitButton
                    isLoading={isCreatingCustomer}
                    label="Create Customer"
                    loadingLabel="Creating..."
                  />


                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}