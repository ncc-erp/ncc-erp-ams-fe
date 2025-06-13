export interface IWebhookResponse {
  id: number;
  name: string;
  url: string;
  created_at?: {
    datetime: string;
    formatted: string;
  };
}
export interface IWebhookRequest {
  id: number;
  name: string;
  url: string;
}
export interface IWebhook {
  id: string;
  name: string;
  url: string;
  created_at: {
    datetime: string;
    formatted: string;
  };
}
