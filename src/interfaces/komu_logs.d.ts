export interface IKomuLogsResponse {
  id: number;
  send_to: string;
  message: string;
  creator: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
  };
  system_response: string;
  status: number;
  created_at?: {
    datetime: string;
    formatted: string;
  };
  updated_at?: {
    datetime: string;
    formatted: string;
  };
}
export interface IKomuLogs {
  id: string;
  send_to: string;
  message: string;
  creator: {
    id: number;
    name: string;
  };
  company: {
    id: number;
    name: string;
  };
  system_response: string;
  status: number;
  created_at?: {
    datetime: string;
    formatted: string;
  };
  updated_at?: {
    datetime: string;
    formatted: string;
  };
}
