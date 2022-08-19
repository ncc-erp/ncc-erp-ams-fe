export interface IModel {
  id: number;
  name: string;
  datetime: string;
}

export interface IModelRequest {
  name: string;
  manufacturer: string;
  category: number;
  notes: string;
  requestable: number;
  assets_count: number;
}

export interface IModelResponse {
  id: number;
  name: string;
  manufacturer: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
  notes: string;
  requestable: boolean;
  assets_count: number;
}
