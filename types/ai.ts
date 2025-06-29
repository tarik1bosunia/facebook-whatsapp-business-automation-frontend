export type AIConfiguration = {
  ai_model?: string;
  api_key?: string; // write-only
  response_tone?: 'friendly' | 'professional' | 'formal' | 'helpful';
  brand_persona?: string;
  auto_respond?: boolean;
  generate_suggestions?: boolean;
  human_handoff?: boolean;
  learn_from_history?: boolean;
};