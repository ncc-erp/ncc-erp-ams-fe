export interface ICategory {
  id: string;
  title: string;
}
export interface ITable<T> {
  rows: T[];
  total: number;
}

export interface IHardware {
  total: number;
  id: string;
  datetime: string;
  date: string;
}
// from demo
export interface IPost {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  createdAt: string;
  category: ICategory;
}
export interface ISelectItem {
  key: number;
  map: any;
  asset: [];
}
export interface ICheckboxProps {
  name: string;
}
export interface ICheckboxChange {
  target: {
    checked: boolean;
  };
}

export interface IUserType {
  name: string;
}

export interface IJobPosition {
  name: string;
}

export interface ITotalDetail {
  name: string;
  total: number;
}

export type IValidationErrors<T> = {
  [K in keyof T]?: string[];
};
