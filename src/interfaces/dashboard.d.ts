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
}

export interface ILocation {
  id: number;
  name: string;
  assets_count: number;
  categories: ICategoryAsset[];
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
