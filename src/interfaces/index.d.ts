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

// export interface ICheckRespone {
//   // available_actions: {
//   //   checkin: boolean;
//   //   checkout: boolean;
//   //   clone: boolean;
//   //   delete: boolean;
//   //   restore: boolean;
//   //   update: boolean;
//   // };
//   category: {
//     id: number;
//     name: string;
//   };
//   checkin_counter: boolean;
//   checkout_counter: boolean;
//   company: {
//     id: number;
//     name: string;
//   };
//   created_at: {
//     datetime: string;
//     formatted: string;
//   };
//   id: number;
//   image: string;
//   last_audit_date: string;
//   last_checkout: string;
//   location: {
//     id: number;
//     name: string;
//   };
//   manufacturer: {
//     id: number;
//     name: string;
//   };
//   model: {
//     id: number;
//     name: string;
//   };
//   model_number: string;
//   name: string;
//   next_audit_date: string;
//   notes: string;
//   order_number: string;
//   purchase_cost: string;
//   purchase_date: {
//     date: string;
//     formatted: string;
//   };
//   requests_counter: number;
//   rtd_location: {
//     id: number;
//     name: string;
//   };
//   serial: string;
//   status_label: {
//     id: number;
//     name: string;
//     status_meta: string;
//     status_type: string;
//   };
//   supplier: {
//     id: number;
//     name: string;
//   };
//   updated_at: {
//     datetime: string;
//     formatted: string;
//   };
//   user_can_checkout: boolean;
//   warranty_expires: {
//     date: string;
//     formatted: string;
//   };
//   warranty_months: string;
// }
