import { RequestStatus, StatusType } from "constants/w2request";
import i18n from "i18n";

export const getBGRequestAssignedStatusDecription = (value: string) =>
  value == RequestStatus.APPROVED
    ? "#0073b7"
    : value == RequestStatus.REJECTED
    ? "red"
    : "#f39c12";

export const getRequestStatusDecription = (value: string) =>
  i18n.t(`w2request.label.status.${StatusType[value]}`);
