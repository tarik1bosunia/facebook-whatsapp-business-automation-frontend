import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IntegrationConfig, IntegrationResponse } from "@/types/integration";
import {
  useGetWhatsAppIntegrationQuery,
  useUpdateWhatsAppIntegrationMutation,
} from "../redux/features/integrationsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export default function useWhatsAppIntegrationForm() {
  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = useGetWhatsAppIntegrationQuery();
  const [updateIntegration, { isLoading: isUpdating }] =
    useUpdateWhatsAppIntegrationMutation();

  const [formData, setFormData] = useState<IntegrationConfig>({
    is_connected: false,
    is_send_auto_reply: true,
    is_send_notification: true,
    platform_id: "",
    access_token: "",
    verify_token: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof IntegrationConfig, string>>
  >({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange =
    (field: keyof IntegrationConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleCheckboxChange =
    (field: keyof IntegrationConfig) => async (value: boolean) => {
      const updated = { [field]: value };
      setFormData((prev) => ({ ...prev, ...updated }));
      try {
        await updateIntegration(updated).unwrap();
        toast.success("Updated successfully");
      } catch (error) {
        handleError(error as FetchBaseQueryError | SerializedError);
      }
    };

  useEffect(() => {
    if (data) {
      setFormData({
        is_connected: data.is_connected ?? false,
        is_send_auto_reply: data.is_send_auto_reply ?? true,
        is_send_notification: data.is_send_notification ?? true,
        platform_id: data.platform_id ?? "",
        access_token: data.access_token ? "********" : "",
        verify_token: data.verify_token ? "********" : "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (fetchError) {
      handleError(fetchError);
    }
  }, [fetchError]);

  const handleError = (error: FetchBaseQueryError | SerializedError) => {
    let errorMessage = "An unexpected error occurred";

    if ("data" in error) {
      const errData = error.data as IntegrationResponse;
      errorMessage = errData.message || "Validation failed";

      if (errData.errors) {
        const newErrors: typeof errors = {};
        Object.entries(errData.errors).forEach(([field, messages]) => {
          newErrors[field as keyof IntegrationConfig] = messages.join(", ");
        });
        setErrors(newErrors);
      }
    }

    toast.error(errorMessage);
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      access_token:
        formData.access_token === "********"
          ? undefined
          : formData.access_token,
      verify_token:
        formData.verify_token === "********"
          ? undefined
          : formData.verify_token,
    };

    try {
      await updateIntegration(payload).unwrap();
      toast.success("Settings saved successfully!");
      setIsDirty(false);
    } catch (error) {
      handleError(error as FetchBaseQueryError | SerializedError);
    }
  };

  const handleConnect = async () => {
    const payload = {
      is_connected: true,
      platform_id: formData.platform_id,
      access_token:
        formData.access_token === "********"
          ? undefined
          : formData.access_token,
      verify_token:
        formData.verify_token === "********"
          ? undefined
          : formData.verify_token,
    };

    if (
      !payload.platform_id ||
      !payload.access_token ||
      !payload.verify_token
    ) {
      toast.error("Please fill in Page ID, Access Token and Verify Token");
      return;
    }

    try {
      await updateIntegration(payload).unwrap();
      setFormData((prev) => ({ ...prev, is_connected: true }));
      toast.success("Successfully connected");
    } catch (error) {
      handleError(error as FetchBaseQueryError | SerializedError);
    }
  };

  const handleDisconnect = async () => {
    try {
      await updateIntegration({ is_connected: false }).unwrap();
      setFormData((prev) => ({ ...prev, is_connected: false }));
      toast.success("Disconnected successfully");
    } catch (error) {
      handleError(error as FetchBaseQueryError | SerializedError);
    }
  };

  return {
    formData,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    handleConnect,
    handleDisconnect,
    isFetching,
    isUpdating,
    isConnected: formData.is_connected,
    isDirty,
    errors,
    platformId: formData.platform_id,
  };
};
