// types/integration.ts
import { RegisterOptions } from 'react-hook-form';

export interface IntegrationConfig {
  is_connected: boolean;
  is_send_auto_reply: boolean;
  is_send_notification: boolean;
  platform_id?: string;
  access_token?: string;
  verify_token?: string;
}

export type IntegrationResponse = IntegrationConfig & {
  errors?: Record<string, string[]>;
  message?: string;
};

export type IntegrationFieldValidation = {
  [K in keyof IntegrationConfig]?: RegisterOptions<IntegrationConfig, K>;
};