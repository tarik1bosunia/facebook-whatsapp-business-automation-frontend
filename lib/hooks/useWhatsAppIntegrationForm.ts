// hooks/useWhatsAppIntegrationForm.ts
import { useForm } from "react-hook-form";
import {
  useGetWhatsAppIntegrationQuery,
  useUpdateWhatsAppIntegrationMutation,
  IntegrationConfig,
} from "@/lib/redux/features/integrationsApi";

import { useEffect } from "react";
import { toast } from "react-toastify";

export const useWhatsAppIntegrationForm = () => {
  const { data, isLoading } = useGetWhatsAppIntegrationQuery();
  const [updateWhatsAppIntegration, { isLoading: isUpdating }] =
    useUpdateWhatsAppIntegrationMutation();

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
      await updateWhatsAppIntegration(formData).unwrap();
      toast.success("WhatsApp configuration updated!");
    } catch  {
      toast.error("Update failed.");
    }
  };

  const handleDisconnect = async () => {
    try {
      const updated = await updateWhatsAppIntegration({ is_connected: false }).unwrap();
      reset(updated);
      toast.success("Disconnected from WhatsApp.");
    } catch {
      toast.error("Failed to disconnect.");
    }
  };

  const handleReconnect = async () => {
    try {
      const updated = await updateWhatsAppIntegration({ is_connected: true }).unwrap();
      reset(updated);
      toast.success("Reconnected to WhatsApp.");
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
