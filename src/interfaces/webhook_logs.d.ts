export interface IWebhookLogsResponse {
  id: number;
  url: string;
  message: string;
  webhook: {
    id: number;
    name: string;
  };
  asset: string;
  status_code: number;
  response: number;
  created_at?: {
    datetime: string;
    formatted: string;
  };
  updated_at?: {
    datetime: string;
    formatted: string;
  };
  type: string;
}
export interface IWebhookLogs {
  id: number;
  url: string;
  message: string;
  webhook: {
    id: number;
    name: string;
  };
  asset: string;
  status_code: number;
  response: number;
  created_at?: {
    datetime: string;
    formatted: string;
  };
  updated_at?: {
    datetime: string;
    formatted: string;
  };
  type: string;
}
