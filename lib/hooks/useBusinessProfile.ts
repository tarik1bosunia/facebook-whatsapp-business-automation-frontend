import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useGetBusinessProfileQuery, useUpdateBusinessProfileMutation } from '@/lib/redux/services/businessApi';
import { BusinessProfile } from '@/types/business';

export default function useBusinessProfile() {
  const { data: profileData, isLoading, refetch } = useGetBusinessProfileQuery();
  const [updateBusinessProfile, { isLoading: isUpdatingProfile }] = useUpdateBusinessProfileMutation();

  const [profileForm, setProfileForm] = useState<Partial<BusinessProfile>>({
    name: '',
    email: '',
    phone: '',
    website: '',
    description: '',
  });

  useEffect(() => {
    if (profileData) {
      setProfileForm(profileData);
    }
  }, [profileData]);

  const handleInputChange = (field: keyof BusinessProfile, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateBusinessProfile(profileForm).unwrap();
      toast.success('Business profile updated successfully');
      refetch();
    } catch (err) {
      const error = err as { data?: { detail?: string } };
      toast.error(error.data?.detail || 'Failed to update business profile');
    }
  };

  return {
    profileForm,
    isLoading,
    isUpdatingProfile,
    handleInputChange,
    handleSaveProfile,
  };
}
