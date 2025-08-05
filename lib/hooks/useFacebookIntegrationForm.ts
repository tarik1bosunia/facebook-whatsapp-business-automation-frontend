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
    (field: keyof IntegrationConfig | "platform_id_facebook" | "verify_token_facebook") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      let actualField: keyof IntegrationConfig;
      if (field === "platform_id_facebook") {
        actualField = "platform_id";
      } else if (field === "verify_token_facebook") {
        actualField = "verify_token";
      } else {
        actualField = field;
      }
      setFormData((prev) => ({ ...prev, [actualField]: value }));
      setIsDirty(true);

      // Clear field error when user types
      if (fieldErrors[actualField]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[actualField];
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
      let errorMessage = "An unexpected error occurred";

      if ("data" in error) {
        const errorData = error.data;
        if (isErrorResponse(errorData)) {
          const errData: ErrorResponse = errorData;
          const { errors: apiErrors } = errData;

          const newFieldErrors: FieldErrorMap = {};

          Object.entries(apiErrors).forEach(([field, errors]) => {
            if (field !== "non_field_errors" && field !== "detail") {
              newFieldErrors[field] = Array.isArray(errors)
                ? errors.map(String)
                : [String(errors)];
            }
          });

          if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
          }

          errorMessage =
            String(apiErrors.non_field_errors?.[0] || "") ||
            String(apiErrors.detail?.[0] || "") ||
            errorMessage;
        } else if (
          typeof errorData === "object" &&
          errorData !== null &&
          "error" in errorData &&
          typeof (errorData as { error: string }).error === "string"
        ) {
          // Handle the specific case where data contains a top-level 'error' string
          errorMessage = (errorData as { error: string }).error;
        }
      } else if ("error" in error && typeof error.error === "string") {
        errorMessage = error.error;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      if (errorMessage) {
        toast.error(errorMessage);
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
