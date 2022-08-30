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
  DEFAULT: 0,
  PENDING_ACCEPT: 1,
  ACCEPT: 2,
  REFUSE: 3,
  WAITING_CHECKOUT: 4,
  WAITING_CHECKIN: 5,
};

export const STATUS_LABELS = {
  PENDING: 1,
  BROKEN: 3,
  ASSIGN: 4,
  READY_TO_DEPLOY: 5,
  CHECKIN: 6
};

export enum EStatus {
  PENDING = "Pending",
  BROKEN = "Broken",
  READY_TO_DEPLOY = "Ready to Deploy",
  ASSIGN = "Assign",
}

export const TypeAssetHistory = {
  CHECKOUT: "checkout",
  CHECKIN: "checkin from",
};

export const ActionType = {
  checkout: "Cấp phát",
  "checkin from": "Thu hồi",
  update: "Chỉnh sửa",
  delete: "Xóa",
  "create new": "Tạo mới",
  create: "Tạo mới",
};

export const dateFormat = "YYYY/MM/DD";

export const requestable = {
  REQUIRED : "1",
  REFUSE: "0"
}
