import { AIConfiguration } from "@/types/ai";
import {
  useGetAIConfigurationQuery,
  useUpdateAIConfigurationMutation,
} from "@/lib/redux/features/ai/aiConfigApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetAIModelsQuery } from "../redux/features/ai/aiModelApi";

export function useAISettings() {
  const { data, isLoading, error, refetch } = useGetAIConfigurationQuery();
  const { data: aiModels, isLoading: aiModelIsloading } = useGetAIModelsQuery();
  const [updateAIConfiguration, { isLoading: isSaving }] =
    useUpdateAIConfigurationMutation();

  const [form, setForm] = useState<AIConfiguration>({
    ai_model: "gemini-pro",
    api_key: "",
    response_tone: "friendly",
    brand_persona: "",
    auto_respond: true,
    generate_suggestions: true,
    human_handoff: true,
    learn_from_history: true,
  });

  useEffect(() => {
    if (data) {
      setForm((prev) => ({
        ...prev,
        ...data,
        api_key: "", // keep empty for write-only
      }));
    }
  }, [data]);

  const handleChange = <K extends keyof AIConfiguration>(
    key: K,
    value: AIConfiguration[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAIConfiguration(form).unwrap();
      toast.success("Configuration saved successfully");
      refetch()
    } catch (err) {
      console.error("Failed to update config:", err);
            toast.error(
        err instanceof Error 
          ? err.message 
          : 'Failed to save configuration'
      );
    }
  };

  return {
    aiModels,
    form,
    isLoading: isLoading && aiModelIsloading,
    isSaving,
    error,
    handleChange,
    handleSave,
    refetch,
  };
}

/**
const handleChange = <K extends keyof AIConfiguration>(key: K, value: AIConfiguration[K]) => {
  setForm((prev) => ({ ...prev, [key]: value }));
};
What It Does:
This is a generic function that updates a specific field in your form state object while maintaining strict type safety.

Key Components:
Generic Type Parameter (<K>)

K extends keyof AIConfiguration means K can only be one of the keys (property names) of your AIConfiguration type

For example, if AIConfiguration has properties ai_model, api_key, etc., then K can only be one of these strings

Parameters

key: K: The property name to update (must be a valid key from AIConfiguration)

value: AIConfiguration[K]: The new value for that property, where the type must match the property's type in AIConfiguration

Type Safety Benefits

The compiler will enforce that:

You can't pass a key that doesn't exist in AIConfiguration

The value's type must match the expected type for that property

For example:

If ai_model expects a string, you can't pass a boolean

If auto_respond expects a boolean, you can't pass a string
 
 */
