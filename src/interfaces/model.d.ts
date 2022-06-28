export interface IModel {
  id: number;
  name: string;
}

export interface IModelRequest {
  name: string;
  manufacturer: string;
  category: number;
  model_number: string;
  depreciation: string;
  eol: string;
  fieldset: string;
  notes: string;
  requestable: number;
  image: string;
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
  depreciation: number;
  image: string;
  eol: string;
  fieldset: string;
  model_number: string;
  notes: string;
  requestable: boolean;
  assets_count: number;
}
