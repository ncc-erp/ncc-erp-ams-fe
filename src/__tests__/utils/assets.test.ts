import {
  getAssetAssignedStatusDecription,
  getBGAssetAssignedStatusDecription,
  getAssetStatusDecription,
  getBGAssetStatusDecription,
  getDetailAssetStatus,
  getDetailAssetStatusByName,
  filterAssignedStatus,
  parseJwt,
} from "utils/assets";
import { IHardwareResponse } from "interfaces/hardware";

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
  name: "hardware.label.field.assign",
  status_type: "",
  status_meta: "",
};

const mockHardwareResponse: IHardwareResponse = {
  id: 1,
  asset_tag: "A001",
  serial: "SN001",
  model: { id: 10, name: "Dell XPS" },
  model_number: "XPS13",
  manufacturer: { id: 9, name: "Dell Inc." },
  warranty_expires: { date: "2025-01-01", formatted: "01/01/2025" },
  note: "Extra note",
  status_label: mockStatusLabel,
  category: { id: 3, name: "Electronics" },
  supplier: { id: 4, name: "Dell" },
  notes: "Test note",
  order_number: "ORD123",
  location: { id: 5, name: "Hanoi" },
  webhook: { id: 11, name: "Webhook" },
  rtd_location: { id: 6, name: "Storage" },
  image: "image.png",
  warranty_months: "12",
  purchase_cost: 1500,
  purchase_date: { date: "2024-01-01", formatted: "01/01/2024" },
  assigned_to: {
    id: 20,
    name: "User A",
    username: "usera",
    last_name: "A",
    first_name: "User",
  },
  last_audit_date: "2024-06-01",
  requestable: "true",
  physical: 1,
  withdraw_from: 1,
  maintenance_date: { date: "2024-08-01", formatted: "01/08/2024" },
  maintenance_cycle: "6",
  name: "hardware.label.field.assign",
  expected_checkin: { date: "2024-07-01", formatted: "01/07/2024" },
  last_checkout: { date: "2024-06-15", formatted: "15/06/2024" },
  assigned_location: { id: 7, name: "Office" },
  assigned_user: 8,
  assigned_asset: "AssetX",
  checkout_to_type: {
    assigned_user: 8,
    assigned_asset: "AssetX",
    assigned_location: { id: 7, name: "Office" },
  },
  user_can_checkout: true,
  user_can_checkin: true,
  assigned_status: 1,
  checkin_at: { date: "2024-07-02", formatted: "02/07/2024" },
  created_at: { datetime: "2024-01-01T00:00:00Z", formatted: "01/01/2024" },
  updated_at: { datetime: "2024-06-01T00:00:00Z", formatted: "01/06/2024" },
  checkin_counter: 2,
  checkout_counter: 3,
  requests_counter: 1,
  startRentalDate: { date: "2024-05-01", formatted: "01/05/2024" },
};

describe("assets utils", () => {
  it("getAssetAssignedStatusDecription returns correct label", () => {
    expect(getAssetAssignedStatusDecription(0)).toBe(
      "hardware.label.detail.default"
    );
    expect(getAssetAssignedStatusDecription(1)).toBe(
      "hardware.label.detail.waitingAcceptCheckout"
    );
    expect(getAssetAssignedStatusDecription(2)).toBe(
      "hardware.label.detail.waitingAcceptCheckin"
    );
    expect(getAssetAssignedStatusDecription(3)).toBe(
      "hardware.label.detail.accept"
    );
    expect(getAssetAssignedStatusDecription(4)).toBe(
      "hardware.label.detail.refuse"
    );
    expect(getAssetAssignedStatusDecription(5)).toBe(
      "hardware.label.detail.pendingAccept"
    );
    expect(getAssetAssignedStatusDecription(999)).toBe("");
  });

  it("getBGAssetAssignedStatusDecription returns correct color", () => {
    expect(getBGAssetAssignedStatusDecription(0)).toBe("gray");
    expect(getBGAssetAssignedStatusDecription(1)).toBe("#f39c12");
    expect(getBGAssetAssignedStatusDecription(2)).toBe("#f39c12");
    expect(getBGAssetAssignedStatusDecription(3)).toBe("#0073b7");
    expect(getBGAssetAssignedStatusDecription(4)).toBe("red");
    expect(getBGAssetAssignedStatusDecription(5)).toBe("#00a65a");
    expect(getBGAssetAssignedStatusDecription(999)).toBe("gray");
  });

  it("getAssetStatusDecription returns correct label", () => {
    expect(
      getAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.assign",
      })
    ).toBe("hardware.label.detail.assign");
    expect(
      getAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.readyToDeploy",
      })
    ).toBe("hardware.label.detail.readyToDeploy");
    expect(
      getAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.broken",
      })
    ).toBe("hardware.label.detail.broken");
    expect(
      getAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.pending",
      })
    ).toBe("hardware.label.detail.pending");
    expect(
      getAssetStatusDecription({
        ...mockHardwareResponse,
        name: "unknown",
      })
    ).toBe("");
  });

  it("getBGAssetStatusDecription returns correct color", () => {
    expect(
      getBGAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.assign",
      })
    ).toBe("#0073b7");
    expect(
      getBGAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.readyToDeploy",
      })
    ).toBe("#00a65a");
    expect(
      getBGAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.broken",
      })
    ).toBe("red");
    expect(
      getBGAssetStatusDecription({
        ...mockHardwareResponse,
        name: "hardware.label.field.pending",
      })
    ).toBe("#f39c12");
    expect(
      getBGAssetStatusDecription({
        ...mockHardwareResponse,
        name: "unknown",
      })
    ).toBe("");
  });

  it("getDetailAssetStatus returns correct label", () => {
    expect(
      getDetailAssetStatus({
        ...mockHardwareResponse,
        status_label: {
          id: 1,
          name: "hardware.label.field.assign",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("hardware.label.detail.assign");
    expect(
      getDetailAssetStatus({
        ...mockHardwareResponse,
        status_label: {
          id: 1,
          name: "hardware.label.field.readyToDeploy",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("hardware.label.detail.readyToDeploy");
    expect(
      getDetailAssetStatus({
        ...mockHardwareResponse,
        status_label: {
          id: 1,
          name: "hardware.label.field.broken",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("hardware.label.detail.broken");
    expect(
      getDetailAssetStatus({
        ...mockHardwareResponse,
        status_label: {
          id: 1,
          name: "hardware.label.field.pending",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("hardware.label.detail.pending");
    expect(
      getDetailAssetStatus({
        ...mockHardwareResponse,
        status_label: {
          id: 2,
          name: "unknown",
          status_type: "",
          status_meta: "",
        },
      })
    ).toBe("");
    expect(getDetailAssetStatus(undefined)).toBe("");
  });

  it("getDetailAssetStatusByName returns correct label", () => {
    expect(getDetailAssetStatusByName("hardware.label.field.assign")).toBe(
      "hardware.label.detail.assign"
    );
    expect(
      getDetailAssetStatusByName("hardware.label.field.readyToDeploy")
    ).toBe("hardware.label.detail.readyToDeploy");
    expect(getDetailAssetStatusByName("hardware.label.field.broken")).toBe(
      "hardware.label.detail.broken"
    );
    expect(getDetailAssetStatusByName("hardware.label.field.pending")).toBe(
      "hardware.label.detail.pending"
    );
    expect(getDetailAssetStatusByName("unknown")).toBe("");
  });

  it("filterAssignedStatus contains correct values", () => {
    expect(Array.isArray(filterAssignedStatus)).toBe(true);
    expect(filterAssignedStatus[0].text).toBe("hardware.label.detail.default");
  });

  it("parseJwt returns decoded payload", () => {
    const payload = { foo: "bar" };
    const base64Payload = btoa(JSON.stringify(payload));
    const token = `header.${base64Payload}.signature`;
    expect(parseJwt(token)).toEqual(payload);
    expect(parseJwt(null)).toBeUndefined();
  });
});
