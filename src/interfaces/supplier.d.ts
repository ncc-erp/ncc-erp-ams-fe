export interface ISupplier {
  id: number;
  name: string;
}

export interface ISupplierRequest {
  id: number;
  name: string;
  address: string;
  contact: string;
  phone: string;
  assets_count: number;
}
