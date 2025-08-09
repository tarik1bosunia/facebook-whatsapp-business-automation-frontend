# Updated Code for `app/(protected)/customers/create/page.tsx`

This file contains the updated code for the customer creation page. The form has been modified to align with the provided `Customer` data model, including fields for name, phone, and address details (city, police station, area).

## `app/(protected)/customers/create/page.tsx`

```tsx
"use client";

import FormStatus from "@/features/create-customer/components/FormStatus";
import SubmitButton from "@/features/create-customer/components/SubmitButton";
import TextInput from "@/features/create-customer/components/TextInput";
import { useCreateCustomerForm } from "@/features/create-customer/hooks/use-create-customer-form";
import { FiUser, FiPhone, FiMapPin, FiHome, FiNavigation } from "react-icons/fi";

export default function CreateCustomerPage() {
  const {
    handleSubmit,
    formData,
    handleInputChange,
    isCreatingCustomer,
    isSuccess,
    isError,
    error,
  } = useCreateCustomerForm();

  return (
    <div
      className="min-h-screen bg-gray-50 py-2 px-4 sm:px-6 lg:px-8"
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
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Address Information
                  </h3>

                  <TextInput
                    icon={<FiMapPin />}
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Rajshahi"
                    required
                  />

                  <TextInput
                    icon={<FiHome />}
                    label="Police Station"
                    name="police_station"
                    value={formData.police_station}
                    onChange={handleInputChange}
                    placeholder="Motihar"
                    required
                  />

                  <TextInput
                    icon={<FiNavigation />}
                    label="Area / Street Address (Optional)"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="Kazla, University Gate"
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