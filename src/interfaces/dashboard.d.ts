export interface IDashboard {
  status: string;
  messages: string;
}

export interface IStatusAsset {
  id: number;
  name: string;
  assets_count: number;
}

export interface ICategoryAsset {
  id: number;
  name: StatusAsset;
  assets_count: number;
  status_labels: IStatusAsset[];
  category_type: string;
  consumables_count: number;
  accessories_count: number;
}

export interface ILocation {
  id: number;
  name: string;
  assets_count: number;
  categories: ICategoryAsset[];
  items_count: number;
  consumables_count: number;
  accessories_count: number;
}

export interface IEntryType {
  name: string;
  code: string;
  pathName: string;
  level: number;
  parentId: number | null;
  workflowId: number;
  expenseType: number;
  id: number;
}

export interface ITreeEntryType {
  name?: string;
  code?: string;
  pathName?: string;
  level?: number;
  parentId?: number | null;
  workflowId?: number;
  expenseType?: number;
  id?: number;
  children?: any[];
}

export interface IActionFinfast {
  statusTransitionId: number;
  workflowId: number;
  fromStatusId: number;
  toStatusId: number;
  name: string;
}
export interface IFinfast {
  outcomingEntryTypeId: number;
  name: string;
  requester: string;
  branchId?: number;
  branchName?: string;
  accountId: number;
  accountName: string;
  currencyId: number;
  currencyName: string;
  value: number;
  workflowStatusId: number;
  workflowStatusName: string;
  workflowStatusCode: string;
  action: IActionFinfast[];
}

export interface IFilters {
  from?: string;
  to?: string;
  entyType?: number[];
}

export interface IAssetHistory {
  category_type: string;
  count: number;
  id: string;
  type: string;
}
export interface DataTable {
  name: string;
  pending: string;
  broken: string;
  assign: string;
  ready_to_deploy: string;
  category_id: number;
  rtd_location_id: number;
  category_type: string;
};
