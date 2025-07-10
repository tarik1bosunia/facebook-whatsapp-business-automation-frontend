'use client';

import {
  TabsContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  FormLabel,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  Textarea,
  Switch,
  Button,
} from '@/components/ui';

import { useAISettings } from '@/lib/hooks/use-ai-config';
import type { AIConfiguration } from '@/types/ai';
export type ResponseTone = 'friendly' | 'professional' | 'formal' | 'helpful';
export function AIConfigTab() {
  const { aiModels, form, isLoading, isSaving, handleChange, handleSave } = useAISettings();

  if (isLoading) return <div className="p-6 text-center">Loading configuration...</div>;

  return (
    <TabsContent value="ai">
      <Card>
        <CardHeader>
          <CardTitle>AI Assistant Configuration</CardTitle>
          <CardDescription>
            Configure how the AI responds to customer inquiries
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* AI Model */}
          <div className="space-y-2">
            <FormLabel>AI Model</FormLabel>
            <Select
              value={form.ai_model}
              onValueChange={(value) => handleChange('ai_model', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                {
                  aiModels?.map((aiModel) => (<SelectItem key={aiModel.id} value={aiModel.id}>{aiModel.name}</SelectItem>))
                }
              </SelectContent>
            </Select>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <FormLabel>API Key</FormLabel>
            <Input
              type="password"
              placeholder="Enter your Gemini API key"
              value={form.api_key}
              onChange={(e) => handleChange('api_key', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is encrypted and stored securely
            </p>
          </div>

          {/* Response Tone */}
          <div className="space-y-2">
            <FormLabel>AI Response Tone</FormLabel>
            <Select
              value={form.response_tone}
              onValueChange={(value: ResponseTone) => handleChange('response_tone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friendly">Friendly and Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="helpful">Helpful and Informative</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Brand Persona */}
          <div className="space-y-2">
            <FormLabel>Brand Persona Instructions</FormLabel>
            <Textarea
              rows={3}
              placeholder="Instructions for how the AI should represent your brand..."
              value={form.brand_persona}
              onChange={(e) => handleChange('brand_persona', e.target.value)}
            />
          </div>

          {/* Behavior Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">AI Behavior Settings</h4>
            <div className="space-y-2">
              {[
                { key: 'auto_respond', label: 'Auto-respond to common questions' },
                { key: 'generate_suggestions', label: 'Generate order suggestions' },
                { key: 'human_handoff', label: 'Human handoff for complex inquiries' },
                { key: 'learn_from_history', label: 'Learn from conversation history' },
              ].map((setting) => (
                <div key={setting.key} className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">{setting.label}</label>
                  <Switch
                    checked={form[setting.key as keyof AIConfiguration] as boolean}
                    onCheckedChange={(checked) =>
                      handleChange(setting.key as keyof AIConfiguration, checked)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </CardFooter>
      </Card>
    </TabsContent>
  );
}
