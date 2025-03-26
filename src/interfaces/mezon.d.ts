export interface MezonWebView {
  postEvent: (
    eventType: string,
    eventData: any,
    callback?: (error?: any) => void
  ) => void;
  receiveEvent: (eventType: string, eventData: any) => void;
  onEvent: (
    eventType: string,
    callback: (eventType: string, eventData: any) => void
  ) => void;
  offEvent: (
    eventType: string,
    callback: (eventType: string, eventData: any) => void
  ) => void;
}

export interface Mezon {
  WebView: MezonWebView;
}

export declare global {
  interface Window {
    Mezon: Mezon;
  }
}

export interface MezonUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  lang_tag: string;
  metadata: string;
  google_id: string;
  online: boolean;
  edge_count: number;
  create_time: string;
  update_time: string;
  dob: string;
}

export interface Wallet {
  value: number;
}

export interface MezonUserProfile {
  user: MezonUser;
  wallet: string;
  email: string;
  mezon_id: string;
}

export interface MezonUserHash {
  message: MezonUserHashInfo;
}

export interface MezonUserHashInfo {
  web_app_data: string;
}

export interface LoginMezonByHashParams {
  userName: string;
  userEmail: string;
  dataCheck: string;
  hashKey: string;
}
