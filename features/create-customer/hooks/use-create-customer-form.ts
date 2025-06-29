import { useGetUsersByPlatformQuery } from "@/lib/redux/services/conversationApi";
import { useCreateCustomerMutation } from "@/lib/redux/services/customerApi";
import { useState } from "react";

interface SocialMediaOption {
  value: string;
  label: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  facebookId: string;
  whatsappId: string;
}

export function useCreateCustomerForm() {
      // Form state management
      const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        facebookId: '',
        whatsappId: '',
      });

        // Search and dropdown states
        const [facebookSearch, setFacebookSearch] = useState('');
        const [whatsappSearch, setWhatsappSearch] = useState('');
        const [showFacebookDropdown, setShowFacebookDropdown] = useState(false);
        const [showWhatsappDropdown, setShowWhatsappDropdown] = useState(false);
      
      // API queries for social media users 
      // TODO: exclude_customers: true for production
      const facebookQuery = useGetUsersByPlatformQuery(
        { platform: "facebook", search: facebookSearch, exclude_customers: false },
        { skip: !showFacebookDropdown && !facebookSearch,  }
      );
    
      const whatsappQuery = useGetUsersByPlatformQuery(
        { platform: "whatsapp", search: whatsappSearch, exclude_customers: false },
        { skip: !showWhatsappDropdown && !whatsappSearch }
      );

        // Customer creation mutation
  const [createCustomer, { 
    isLoading: isCreatingCustomer, 
    isSuccess, 
    isError, 
    error 
  }] = useCreateCustomerMutation();

  // Convert API data to dropdown options
  const facebookOptions = (facebookQuery.data || []).map(user => ({
    value: user.social_media_id,
    label: `${user.social_media_id} (${user.name})`
  }));

  const whatsappOptions = (whatsappQuery.data || []).map(user => ({
    value: user.social_media_id,
    label: `${user.social_media_id} (${user.name})`
  }));

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    // Handle social media selection from dropdown
    const handleSocialMediaSelect = (type: 'facebook' | 'whatsapp', value: string) => {
      setFormData(prev => ({ ...prev, [`${type}Id`]: value }));
      setShowFacebookDropdown(false);
      setShowWhatsappDropdown(false);
      setFacebookSearch('');
      setWhatsappSearch('');
    };
  
    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        social_media_ids: [
          ...(formData.facebookId ? [{ facebook: formData.facebookId }] : []),
          ...(formData.whatsappId ? [{ whatsapp: formData.whatsappId }] : []),
        ],
      };
  
      try {
        await createCustomer(payload).unwrap();
        // Reset form on success
        setFormData({
          name: '',
          email: '',
          phone: '',
          facebookId: '',
          whatsappId: '',
        });
      } catch (err) {
        console.error('Submission failed:', err);
      }
    };
  
    // Get display label for selected social media option
    const getSelectedLabel = (value: string, options: SocialMediaOption[]) => {
      const selected = options.find(option => option.value === value);
      return selected ? selected.label : value || '';
    };
  


  return {
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

  };
}
