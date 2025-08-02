import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IntegrationConfig } from "@/types/integration";
import {
  useGetFacebookIntegrationQuery,
  useUpdateFacebookIntegrationMutation,
} from "../redux/features/integrationsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import {
  ErrorResponse,
  FieldErrorMap,
  isErrorResponse,
} from "@/types/apiResponse";

export const useFacebookIntegrationForm = () => {
  const {
    data,
    isLoading: isFetching,
    error: fetchError,
  } = useGetFacebookIntegrationQuery();

  const [updateIntegration, { isLoading: isUpdating }] =
    useUpdateFacebookIntegrationMutation();

  const [formData, setFormData] = useState<IntegrationConfig>({
    is_connected: false,
    is_send_auto_reply: true,
    is_send_notification: true,
    platform_id: "",
    access_token: "",
    verify_token: "",
  });

  const [fieldErrors, setFieldErrors] = useState<FieldErrorMap>({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange =
    (field: keyof IntegrationConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);

      // Clear field error when user types
      if (fieldErrors[field]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
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

  const handleError = useCallback(
    (error: FetchBaseQueryError | SerializedError) => {
      if ("data" in error && isErrorResponse(error.data)) {
        const errData: ErrorResponse = error.data;
        const { errors: apiErrors } = errData;

        const newFieldErrors: FieldErrorMap = {};

        Object.entries(apiErrors).forEach(([field, errors]) => {
          if (field !== "non_field_errors" && field !== "detail") {
            // Convert error to array format if it isn't already
            newFieldErrors[field] = Array.isArray(errors)
              ? errors.map(String)
              : [String(errors)];
          }
        });

        if (Object.keys(newFieldErrors).length > 0) {
          setFieldErrors(newFieldErrors);
        }

        // Show non-field errors
        const message =
          apiErrors.non_field_errors?.[0] ||
          apiErrors.detail?.[0] ||
          "An error occurred";

        if (message) {
          toast.error(String(message));
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    },
    []
  );

  useEffect(() => {
    if (fetchError) {
      handleError(fetchError);
    }
  }, [fetchError, handleError]);

  useEffect(() => {
    if (data && !isErrorResponse(data)) {
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

  const handleSubmit = async () => {
    setFieldErrors({});
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
    console.log("payload", payload);

    try {
      const response = await updateIntegration(payload).unwrap();
      if (!isErrorResponse(response)) {
        toast.success("Settings saved successfully!");
        setIsDirty(false);
      } else {
        handleError({ data: response } as FetchBaseQueryError);
      }
    } catch (error) {
      handleError(error as FetchBaseQueryError | SerializedError);
    }
  };

  const handleConnect = async () => {
    setFieldErrors({});

    const payload = {
      is_connected: true,
      platform_id: formData.platform_id,
      access_token:
        formData.access_token === "********" || !formData.access_token
          ? undefined // Use existing token if masked or empty
          : formData.access_token,
      verify_token:
        formData.verify_token === "********" || !formData.verify_token
          ? undefined // Use existing token if masked or empty
          : formData.verify_token,
    };

    console.log("payload", payload)

    try {
      const response = await updateIntegration(payload).unwrap();
      if (!isErrorResponse(response)) {
        setFormData((prev) => ({ ...prev, is_connected: true }));
        toast.success("Successfully connected");
      } else {
        handleError({ data: response } as FetchBaseQueryError);
      }
    } catch (error) {
      handleError(error as FetchBaseQueryError | SerializedError);
    }
  };

  const handleDisconnect = async () => {
    try {
      const response = await updateIntegration({
        is_connected: false,
      }).unwrap();
      if (!isErrorResponse(response)) {
        setFormData((prev) => ({ ...prev, is_connected: false }));
        toast.success("Disconnected successfully");
      } else {
        handleError({ data: response } as FetchBaseQueryError);
      }
    } catch (error) {
      handleError(error as FetchBaseQueryError | SerializedError);
    }
  };

  return {
    formData,
    fieldErrors,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    handleConnect,
    handleDisconnect,
    isFetching,
    isUpdating,
    isConnected: formData.is_connected,
    isDirty,
    platformId: formData.platform_id,
  };
};
