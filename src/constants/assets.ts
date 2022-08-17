export const defaultCheckedListWaitingConfirm = [
  "id",
  "name",
  "image",
  "model",
  "category",
  "status_label",
  "assigned_to",
  "assigned_status",
  "purchase_date",
];

export const ASSIGNED_STATUS = {
  NO_ASSIGN: 0,
  PENDING_ACCEPT: 1,
  ACCEPT: 2,
  REFUSE: 3,
};

export const STATUS_LABELS = {
  PENDING: 1,
  BROKEN: 3,
  ASSIGN: 4,
  READY_TO_DEPLOY: 5,
};

export enum EStatus {
  PENDING = "Pending",
  BROKEN = "Broken",
  READY_TO_DEPLOY = "Ready to Deploy",
  ASSIGN = "Assign",
}

export const TypeAssetHistory = {
  CHECKOUT: 0,
  CHECKIN: 1
}
export const dateFormat = "YYYY/MM/DD";

export enum EPermissions {
  ADMIN =  "1",
  USER = "0"
}

