import {
  getToolAssignedStatusDecription,
  getBGToolAssignedStatusDecription,
  getToolStatusDecription,
  getBGToolStatusDecription,
  getDetailToolStatus,
  filterAssignedStatus,
  parseJwt,
} from "utils/tools";
import { IToolResponse } from "interfaces/tool";

jest.mock("constants/assets", () => ({
  ASSIGNED_STATUS: {
    DEFAULT: 0,
    WAITING_CHECKOUT: 1,
    WAITING_CHECKIN: 2,
    ACCEPT: 3,
    REFUSE: 4,
    PENDING_ACCEPT: 5,
  },
}));
jest.mock("../../i18n", () => ({
  t: (key: string) => key,
}));

const mockStatusLabel = {
  id: 1,
  name: "tools.label.field.assign",
  status_type: "",
  status_meta: "",
};

const mockToolResponse: IToolResponse = {
  id: 1,
  name: "tools.label.field.assign",
  purchase_cost: 1000,
  assigned_to: {
    id: 2,
    username: "user",
    name: "User Name",
    first_name: "User",
    last_name: "Name",
  },
  status_label: mockStatusLabel,
  supplier: { id: 3, name: "Supplier" },
  category: { id: 4, name: "Category" },
  location: { id: 5, name: "Location" },
  notes: "Test note",
  qty: 10,
  checkout_counter: 2,
  checkin_counter: 3,
  assigned_status: 1,
  user_can_checkout: true,
  user_can_checkin: true,
  withdraw_from: 1,
  purchase_date: { date: "2024-01-01", formatted: "01/01/2024" },
  expiration_date: { date: "2025-01-01", formatted: "01/01/2025" },
  created_at: { datetime: "2024-01-01T10:00:00Z", formatted: "01/01/2024" },
  updated_at: { datetime: "2024-06-01T10:00:00Z", formatted: "01/06/2024" },
  checkin_date: { datetime: "2024-07-01T10:00:00Z", formatted: "01/07/2024" },
  last_checkout: { datetime: "2024-06-01T10:00:00Z", formatted: "01/06/2024" },
};

describe("tools utils", () => {
  it("getToolAssignedStatusDecription returns correct label", () => {
    expect(getToolAssignedStatusDecription(0)).toBe(
      "tools.label.detail.default"
    );
    expect(getToolAssignedStatusDecription(1)).toBe(
      "tools.label.detail.waitingAcceptCheckout"
    );
    expect(getToolAssignedStatusDecription(2)).toBe(
      "tools.label.detail.waitingAcceptCheckin"
    );
    expect(getToolAssignedStatusDecription(3)).toBe(
      "tools.label.detail.accept"
    );
    expect(getToolAssignedStatusDecription(4)).toBe(
      "tools.label.detail.refuse"
    );
    expect(getToolAssignedStatusDecription(5)).toBe(
      "tools.label.detail.pendingAccept"
    );
    expect(getToolAssignedStatusDecription(999)).toBe("");
  });

  it("getBGToolAssignedStatusDecription returns correct color", () => {
    expect(getBGToolAssignedStatusDecription(0)).toBe("gray");
    expect(getBGToolAssignedStatusDecription(1)).toBe("#f39c12");
    expect(getBGToolAssignedStatusDecription(2)).toBe("#f39c12");
    expect(getBGToolAssignedStatusDecription(3)).toBe("#0073b7");
    expect(getBGToolAssignedStatusDecription(4)).toBe("red");
    expect(getBGToolAssignedStatusDecription(5)).toBe("#00a65a");
    expect(getBGToolAssignedStatusDecription(999)).toBe("gray");
  });

  it("getToolStatusDecription returns correct label", () => {
    expect(
      getToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.assign",
      })
    ).toBe("tools.label.detail.assign");
    expect(
      getToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.readyToDeploy",
      })
    ).toBe("tools.label.detail.readyToDeploy");
    expect(
      getToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.broken",
      })
    ).toBe("tools.label.detail.broken");
    expect(
      getToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.pending",
      })
    ).toBe("tools.label.detail.pending");
    expect(
      getToolStatusDecription({
        ...mockToolResponse,
        name: "unknown",
      })
    ).toBe("");
  });

  it("getBGToolStatusDecription returns correct color", () => {
    expect(
      getBGToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.assign",
      })
    ).toBe("#0073b7");
    expect(
      getBGToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.readyToDeploy",
      })
    ).toBe("#00a65a");
    expect(
      getBGToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.broken",
      })
    ).toBe("red");
    expect(
      getBGToolStatusDecription({
        ...mockToolResponse,
        name: "tools.label.field.pending",
      })
    ).toBe("#f39c12");
    expect(
      getBGToolStatusDecription({
        ...mockToolResponse,
        name: "unknown",
      })
    ).toBe("");
  });

  it("getDetailToolStatus returns correct label", () => {
    expect(
      getDetailToolStatus({
        ...mockToolResponse,
        status_label: {
          id: 1,
          name: "tools.label.field.assign",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("tools.label.detail.assign");
    expect(
      getDetailToolStatus({
        ...mockToolResponse,
        status_label: {
          id: 1,
          name: "tools.label.field.readyToDeploy",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("tools.label.detail.readyToDeploy");
    expect(
      getDetailToolStatus({
        ...mockToolResponse,
        status_label: {
          id: 1,
          name: "tools.label.field.broken",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("tools.label.detail.broken");
    expect(
      getDetailToolStatus({
        ...mockToolResponse,
        status_label: {
          id: 1,
          name: "tools.label.field.pending",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("tools.label.detail.pending");
    expect(
      getDetailToolStatus({
        ...mockToolResponse,
        status_label: {
          id: 2,
          name: "unknown",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("");
    expect(getDetailToolStatus(undefined)).toBe("");
  });

  it("filterAssignedStatus contains correct values", () => {
    expect(Array.isArray(filterAssignedStatus)).toBe(true);
    expect(filterAssignedStatus[0].text).toBe("tools.label.detail.default");
  });

  it("parseJwt returns decoded payload", () => {
    const payload = { foo: "bar" };
    const base64Payload = btoa(JSON.stringify(payload));
    const token = `header.${base64Payload}.signature`;
    expect(parseJwt(token)).toEqual(payload);
    expect(parseJwt(null)).toBeUndefined();
  });
});
