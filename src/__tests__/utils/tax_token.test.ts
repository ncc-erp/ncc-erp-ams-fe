import {
  getTaxTokenStatusDecription,
  getBGTaxTokenStatusDecription,
  getTaxTokenAssignedStatusDecription,
  getBGTaxTokenAssignedStatusDecription,
  getDetailTaxTokenStatus,
} from "utils/tax_token";
import { ITaxTokenResponse } from "interfaces/tax_token";

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

function createMockTaxTokenResponse(name: string): ITaxTokenResponse {
  return {
    id: 1,
    name,
    seri: "SERIAL001",
    supplier: { id: 1, name: "Supplier" },
    location: { id: 2, name: "Location" },
    category: { id: 3, name: "Category" },
    assigned_to: {
      id: 4,
      username: "user",
      name: "User Name",
      first_name: "User",
      last_name: "Name",
    },
    purchase_date: { date: "2024-01-01", formatted: "01/01/2024" },
    purchase_cost: "1000",
    expiration_date: { date: "2025-01-01", formatted: "01/01/2025" },
    last_checkout: {
      datetime: "2024-06-01T10:00:00Z",
      formatted: "01/06/2024",
    },
    checkin_date: { datetime: "2024-07-01T10:00:00Z", formatted: "01/07/2024" },
    status_label: {
      id: 5,
      name,
      status_type: "",
      status_meta: "",
    },
    user_can_checkout: true,
    user_can_checkin: true,
    checkout_counter: 2,
    checkin_counter: 3,
    assigned_status: 1,
    note: "Test note",
    qty: 10,
    warranty_months: 12,
    withdraw_from: 1,
    created_at: { datetime: "2024-01-01T10:00:00Z", formatted: "01/01/2024" },
    updated_at: { datetime: "2024-06-01T10:00:00Z", formatted: "01/06/2024" },
  };
}

describe("tax_token utils", () => {
  it("getTaxTokenStatusDecription returns correct label and color", () => {
    const result = getTaxTokenStatusDecription(
      createMockTaxTokenResponse("Assign")
    );
    expect(result.label).toBe("hardware.label.detail.assign");
    expect(result.color).toBe("#0073b7");
  });

  it("getBGTaxTokenStatusDecription returns correct color", () => {
    expect(
      getBGTaxTokenStatusDecription(
        createMockTaxTokenResponse("hardware.label.field.assign")
      )
    ).toBe("#0073b7");
    expect(
      getBGTaxTokenStatusDecription(
        createMockTaxTokenResponse("hardware.label.field.readyToDeploy")
      )
    ).toBe("#00a65a");
    expect(
      getBGTaxTokenStatusDecription(
        createMockTaxTokenResponse("hardware.label.field.broken")
      )
    ).toBe("red");
    expect(
      getBGTaxTokenStatusDecription(
        createMockTaxTokenResponse("hardware.label.field.pending")
      )
    ).toBe("#f39c12");
    expect(
      getBGTaxTokenStatusDecription(createMockTaxTokenResponse("unknown"))
    ).toBe("");
  });

  it("getTaxTokenAssignedStatusDecription returns correct label", () => {
    expect(getTaxTokenAssignedStatusDecription(0)).toBe(
      "hardware.label.detail.default"
    );
    expect(getTaxTokenAssignedStatusDecription(5)).toBe(
      "hardware.label.detail.pendingAccept"
    );
    expect(getTaxTokenAssignedStatusDecription(3)).toBe(
      "hardware.label.detail.accept"
    );
    expect(getTaxTokenAssignedStatusDecription(4)).toBe(
      "hardware.label.detail.refuse"
    );
    expect(getTaxTokenAssignedStatusDecription(1)).toBe(
      "hardware.label.detail.waitingAcceptCheckout"
    );
    expect(getTaxTokenAssignedStatusDecription(2)).toBe(
      "hardware.label.detail.waitingAcceptCheckin"
    );
    expect(getTaxTokenAssignedStatusDecription(999)).toBe("");
  });

  it("getBGTaxTokenAssignedStatusDecription returns correct color", () => {
    expect(getBGTaxTokenAssignedStatusDecription(0)).toBe("gray");
    expect(getBGTaxTokenAssignedStatusDecription(5)).toBe("#00a65a");
    expect(getBGTaxTokenAssignedStatusDecription(3)).toBe("#0073b7");
    expect(getBGTaxTokenAssignedStatusDecription(4)).toBe("red");
    expect(getBGTaxTokenAssignedStatusDecription(1)).toBe("#f39c12");
    expect(getBGTaxTokenAssignedStatusDecription(2)).toBe("#f39c12");
    expect(getBGTaxTokenAssignedStatusDecription(999)).toBe("gray");
  });

  it("getDetailTaxTokenStatus returns correct label and color", () => {
    const result = getDetailTaxTokenStatus(
      createMockTaxTokenResponse("Assign"),
      (key) => key
    );
    expect(result.label).toBe("tax_token.label.detail.assign");
    expect(result.color).toBe("#0073b7");
  });

  it("getTaxTokenStatusDecription returns default label for unmatched name", () => {
    const result = getTaxTokenStatusDecription(
      createMockTaxTokenResponse("Unmatched")
    );
    expect(result.label).toBe("hardware.label.detail.unknown");
    expect(result.color).toBe("gray");
  });
});
