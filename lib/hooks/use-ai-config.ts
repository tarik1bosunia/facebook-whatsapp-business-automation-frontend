
import { AIConfiguration } from "@/types/ai";
import { useGetAIConfigurationQuery, useUpdateAIConfigurationMutation }  from "@/lib/redux/features/ai/aiConfigApi"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useGetAIModelsQuery } from "../redux/features/ai/aiModelApi";

export function useAISettings() {
  const { data, isLoading, error, refetch } = useGetAIConfigurationQuery();
  const {data: aiModels, isLoading: aiModelIsloading,} = useGetAIModelsQuery()
  const [updateAIConfiguration, { isLoading: isSaving }] = useUpdateAIConfigurationMutation();

  const [form, setForm] = useState<AIConfiguration>({
    ai_model: 'gemini-pro',
    api_key: '',
    response_tone: 'friendly',
    brand_persona: '',
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
        api_key: '', // keep empty for write-only
      }));
    }
  }, [data]);

  const handleChange = (key: keyof AIConfiguration, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAIConfiguration(form).unwrap();
      toast.success('Configuration saved successfully');
    } catch (err) {
      console.error('Failed to update config:', err);
      toast.error('Failed to save configuration');
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
