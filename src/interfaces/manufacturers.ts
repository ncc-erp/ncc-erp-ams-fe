export interface IManufactures {
  id: number;
  name: string;
}
export interface IManufacturesResponse {
  id: number;
  name: string;
  url: string;
  support_url: string;
  support_phone: string;
  support_email: string;
  image: string;
  assets_count: number;
}
export interface IManufacturesRequest {
  id: number;
  name: string;
  url: string;
  support_url: string;
  support_phone: string;
  support_email: string;
  image: string;
}
