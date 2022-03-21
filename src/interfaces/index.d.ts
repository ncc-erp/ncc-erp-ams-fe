export interface ICategory {
  id: string;
  title: string;
}
export interface ITable<T> {
  rows: T[],
  total: number
}

export interface IHardware {
  total: number,
  id: string,
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
