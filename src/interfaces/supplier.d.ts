export interface ISupplier {
  id: number;
  name: string;
}

export interface ISupplierRequest {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  contact: string;
  phone: string;
  fax: string;
  email: string;
  url: string;
  notes: string;
  image: string;
  assets_count: number;
}
