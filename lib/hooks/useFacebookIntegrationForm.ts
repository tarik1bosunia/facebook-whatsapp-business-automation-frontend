// hooks/useFacebookIntegrationForm.ts
import { useForm } from "react-hook-form";
import {
  useGetFacebookIntegrationQuery,
  useUpdateFacebookIntegrationMutation,
  IntegrationConfig,
} from "@/lib/redux/features/integrationsApi";
import { useEffect } from "react";
import { toast } from "react-toastify";

export const useFacebookIntegrationForm = () => {
  const { data, isLoading } = useGetFacebookIntegrationQuery();
  const [updateFacebookIntegration, { isLoading: isUpdating }] =
    useUpdateFacebookIntegrationMutation();

  const { register, handleSubmit, reset, watch } = useForm<IntegrationConfig>({
    defaultValues: {
      is_connected: true,
      is_send_auto_reply: true,
      is_send_notification: true,
      access_token: "",
    },
  });

  const isConnected = watch("is_connected");

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = async (formData: IntegrationConfig) => {
    try {
      await updateFacebookIntegration(formData).unwrap();
      toast.success("Facebook configuration updated!");
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const handleDisconnect = async () => {
    try {
      const updated = await updateFacebookIntegration({ is_connected: false }).unwrap();
      reset(updated);
      toast.success("Disconnected from Facebook.");
    } catch {
      toast.error("Failed to disconnect.");
    }
  };

  const handleReconnect = async () => {
    try {
      const updated = await updateFacebookIntegration({ is_connected: true }).unwrap();
      reset(updated);
      toast.success("Reconnected to Facebook.");
    } catch {
      toast.error("Failed to reconnect.");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    isLoading,
    isUpdating,
    handleDisconnect,
    handleReconnect,
    isConnected,
  };
};
