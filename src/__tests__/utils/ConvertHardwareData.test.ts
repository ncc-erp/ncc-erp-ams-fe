import { convertHardwareToEditData } from "utils/ConvertHardwareData";
import { IHardwareResponse } from "interfaces/hardware";

const baseHardware: IHardwareResponse = {
  id: 1,
  name: "Laptop",
  asset_tag: "A001",
  serial: "SN001",
  model: { id: 10, name: "Dell XPS" },
  model_number: "XPS13",
  status_label: {
    id: 2,
    name: "In Use",
    status_type: "active",
    status_meta: "",
  },
  category: { id: 3, name: "Electronics" },
  manufacturer: { id: 9, name: "Dell Inc." },
  supplier: { id: 4, name: "Dell" },
  notes: "Test note",
  order_number: "ORD123",
  location: { id: 5, name: "Hanoi" },
  webhook: { id: 11, name: "Webhook" },
  rtd_location: { id: 6, name: "Storage" },
  image: "image.png",
  warranty_months: "12",
  warranty_expires: { date: "2025-01-01", formatted: "01/01/2025" },
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
  note: "Extra note",
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
  withdraw_from: 1,
  maintenance_date: { date: "2024-08-01", formatted: "01/08/2024" },
  maintenance_cycle: "6",
  isCustomerRenting: true,
  startRentalDate: { date: "2024-05-01", formatted: "01/05/2024" },
};
describe("branch coverage for convertHardwareToEditData", () => {
  it("should set model_number from order_number and default to undefined when missing", () => {
    const hardware = { ...baseHardware, order_number: "ORD999" };
    const resultWithOrder = convertHardwareToEditData(hardware);
    expect(resultWithOrder.model_number).toBe("ORD999");

    const hardwareNoOrder = { ...baseHardware };
    delete (hardwareNoOrder as any).order_number;
    const resultNoOrder = convertHardwareToEditData(hardwareNoOrder);
    expect(resultNoOrder.model_number).toBeUndefined();
  });

  it("should handle status_label as non-object value", () => {
    const hardware = { ...baseHardware, status_label: "wrong" as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.status_label).toEqual({
      id: 0,
      name: "",
      status_type: "",
      status_meta: "",
    });
  });

  it("should keep webhook when it is valid object", () => {
    const webhookObj = { id: 99, name: "Valid Webhook" };
    const hardware = { ...baseHardware, webhook: webhookObj };
    const result = convertHardwareToEditData(hardware);
    expect(result.webhook).toEqual(webhookObj);
  });

  it("should keep assigned_to when it is valid object", () => {
    const assignedToObj = {
      id: 123,
      name: "Assigned User",
      username: "assigneduser",
      last_name: "User",
      first_name: "Assigned",
    };
    const hardware = { ...baseHardware, assigned_to: assignedToObj };
    const result = convertHardwareToEditData(hardware);
    expect(result.assigned_to).toEqual(assignedToObj);
  });

  it("should keep purchase_date when valid object", () => {
    const purchaseDate = { date: "2025-05-05", formatted: "05/05/2025" };
    const hardware = { ...baseHardware, purchase_date: purchaseDate };
    const result = convertHardwareToEditData(hardware);
    expect(result.purchase_date).toEqual(purchaseDate);
  });

  it("should keep maintenance_date when valid object", () => {
    const maintDate = { date: "2025-06-06", formatted: "06/06/2025" };
    const hardware = { ...baseHardware, maintenance_date: maintDate };
    const result = convertHardwareToEditData(hardware);
    expect(result.maintenance_date).toEqual(maintDate);
  });

  it("should keep warranty_expires when valid object", () => {
    const warranty = { date: "2025-07-07", formatted: "07/07/2025" };
    const hardware = { ...baseHardware, warranty_expires: warranty };
    const result = convertHardwareToEditData(hardware);
    expect(result.warranty_expires).toEqual(warranty);
  });

  it("should keep startRentalDate when valid object", () => {
    const rentalDate = { date: "2025-08-08", formatted: "08/08/2025" };
    const hardware = { ...baseHardware, startRentalDate: rentalDate };
    const result = convertHardwareToEditData(hardware);
    expect(result.startRentalDate).toEqual(rentalDate);
  });

  it("should keep supplier, category, location, rtd_location, model when valid object and set manufacturer default", () => {
    const obj = { id: 77, name: "Valid" };
    const hardware = {
      ...baseHardware,
      manufacturer: obj,
      supplier: obj,
      category: obj,
      location: obj,
      rtd_location: obj,
      model: obj,
    };
    const result = convertHardwareToEditData(hardware);
    // manufacturer is always default
    expect(result.manufacturer).toEqual({ id: 0, name: "" });
    expect(result.supplier).toEqual(obj);
    expect(result.category).toEqual(obj);
    expect(result.location).toEqual(obj);
    expect(result.rtd_location).toEqual(obj);
    expect(result.model).toEqual(obj);
  });
});

describe("convertHardwareToEditData", () => {
  it("should convert hardware data to edit data and keep id, name, asset_tag", () => {
    const result = convertHardwareToEditData(baseHardware);
    expect(result.id).toBe(baseHardware.id);
    expect(result.name).toBe(baseHardware.name);
    expect(result.asset_tag).toBe(baseHardware.asset_tag);
  });

  it("should set default values for missing fields", () => {
    const minimalHardware: IHardwareResponse = {
      ...baseHardware,
      id: 2,
      name: "Minimal",
      asset_tag: "",
      serial: "",
      model: { id: 0, name: "" },
      model_number: "",
      status_label: { id: 0, name: "", status_type: "", status_meta: "" },
      category: { id: 0, name: "" },
      manufacturer: { id: 0, name: "" },
      supplier: { id: 0, name: "" },
      notes: "",
      order_number: "",
      location: { id: 0, name: "" },
      webhook: { id: 0, name: "" },
      rtd_location: { id: 0, name: "" },
      image: "",
      warranty_months: "",
      warranty_expires: { date: "", formatted: "" },
      purchase_cost: 0,
      purchase_date: null as any,
      assigned_to: {
        id: 0,
        name: "",
        username: "",
        last_name: "",
        first_name: "",
      },
      last_audit_date: "",
      requestable: "",
      physical: 0,
      note: "",
      expected_checkin: { date: "", formatted: "" },
      last_checkout: { date: "", formatted: "" },
      assigned_location: { id: 0, name: "" },
      assigned_user: 0,
      assigned_asset: "",
      checkout_to_type: {
        assigned_user: 0,
        assigned_asset: "",
        assigned_location: { id: 0, name: "" },
      },
      user_can_checkout: false,
      user_can_checkin: false,
      assigned_status: 0,
      checkin_at: { date: "", formatted: "" },
      created_at: { datetime: "", formatted: "" },
      updated_at: { datetime: "", formatted: "" },
      checkin_counter: 0,
      checkout_counter: 0,
      requests_counter: 0,
      withdraw_from: 0,
      maintenance_date: null as any,
      maintenance_cycle: "",
      isCustomerRenting: false,
      startRentalDate: { date: "", formatted: "" },
    };
    const result = convertHardwareToEditData(minimalHardware);
    expect(result.id).toBe(2);
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
  });

  it("should handle null and undefined fields gracefully", () => {
    const hardwareWithNulls: IHardwareResponse = {
      ...baseHardware,
      purchase_date: null as any,
      maintenance_date: undefined as any,
      warranty_expires: null as any,
      assigned_to: undefined as any,
    };
    const result = convertHardwareToEditData(hardwareWithNulls);
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
    expect(result.warranty_expires).toEqual({ date: "", formatted: "" });
    expect(result.assigned_to).toEqual({
      id: 0,
      name: "",
      username: "",
      last_name: "",
      first_name: "",
    });
  });

  it("should handle fields with wrong type (string/number instead of object)", () => {
    const hardwareWithWrongType: IHardwareResponse = {
      ...baseHardware,
      purchase_date: "not-an-object" as any,
      maintenance_date: 123 as any,
      warranty_expires: "wrong" as any,
      assigned_to: "not-object" as any,
    };
    const result = convertHardwareToEditData(hardwareWithWrongType);
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
    expect(result.warranty_expires).toEqual({ date: "", formatted: "" });
    expect(result.assigned_to).toEqual({
      id: 0,
      name: "",
      username: "",
      last_name: "",
      first_name: "",
    });
  });

  it("should not throw error if optional fields are missing", () => {
    const hardwareMissingFields = {
      id: 3,
      name: "Missing",
      asset_tag: "",
      serial: "",
      model: { id: 0, name: "" },
      model_number: "",
      status_label: { id: 0, name: "", status_type: "", status_meta: "" },
      category: { id: 0, name: "" },
      manufacturer: { id: 0, name: "" },
      supplier: { id: 0, name: "" },
      notes: "",
      order_number: "",
      location: { id: 0, name: "" },
      webhook: { id: 0, name: "" },
      rtd_location: { id: 0, name: "" },
      image: "",
      warranty_months: "",
      warranty_expires: undefined as any,
      purchase_cost: 0,
      purchase_date: undefined as any,
      assigned_to: undefined as any,
      last_audit_date: "",
      requestable: "",
      physical: 0,
      note: "",
      expected_checkin: undefined as any,
      last_checkout: undefined as any,
      assigned_location: undefined as any,
      assigned_user: 0,
      assigned_asset: "",
      checkout_to_type: undefined as any,
      user_can_checkout: false,
      user_can_checkin: false,
      assigned_status: 0,
      checkin_at: undefined as any,
      created_at: undefined as any,
      updated_at: undefined as any,
      checkin_counter: 0,
      checkout_counter: 0,
      requests_counter: 0,
      withdraw_from: 0,
      maintenance_date: undefined as any,
      maintenance_cycle: "",
      isCustomerRenting: false,
      startRentalDate: undefined as any,
    } as IHardwareResponse;

    expect(() =>
      convertHardwareToEditData(hardwareMissingFields)
    ).not.toThrow();
    const result = convertHardwareToEditData(hardwareMissingFields);
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
    expect(result.warranty_expires).toEqual({ date: "", formatted: "" });
    expect(result.assigned_to).toEqual({
      id: 0,
      name: "",
      username: "",
      last_name: "",
      first_name: "",
    });
  });
  it("should return false for isCustomerRenting when undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).isCustomerRenting;
    const result = convertHardwareToEditData(hardware);
    expect(result.isCustomerRenting).toBe(false);
  });

  it("should keep isCustomerRenting and startRentalDate when valid", () => {
    const hardware = {
      ...baseHardware,
      isCustomerRenting: true,
      startRentalDate: { date: "2025-01-01", formatted: "01/01/2025" },
    };
    const result = convertHardwareToEditData(hardware);
    expect(result.isCustomerRenting).toBe(true);
    expect(result.startRentalDate).toEqual({
      date: "2025-01-01",
      formatted: "01/01/2025",
    });
  });

  it("should default startRentalDate when missing or wrong type", () => {
    const wrongType = {
      ...baseHardware,
      startRentalDate: "not-an-object" as any,
    };
    const resultWrong = convertHardwareToEditData(wrongType);
    expect(resultWrong.startRentalDate).toEqual({ date: "", formatted: "" });

    const missing = { ...baseHardware };
    delete (missing as any).startRentalDate;
    const resultMissing = convertHardwareToEditData(missing);
    expect(resultMissing.startRentalDate).toEqual({ date: "", formatted: "" });
  });
  it("should handle undefined for all object fields", () => {
    const hardware: Partial<IHardwareResponse> = { ...baseHardware };
    hardware.model = undefined;
    hardware.status_label = undefined;
    hardware.category = undefined;
    hardware.supplier = undefined;
    hardware.manufacturer = undefined;
    hardware.location = undefined;
    hardware.rtd_location = undefined;
    hardware.assigned_to = undefined;
    hardware.webhook = undefined;
    hardware.maintenance_date = undefined;
    hardware.startRentalDate = undefined;
    hardware.purchase_date = undefined;
    hardware.warranty_expires = undefined;
    hardware.expected_checkin = undefined;
    hardware.last_checkout = undefined;
    hardware.checkin_at = undefined;
    hardware.created_at = undefined;
    hardware.updated_at = undefined;
    hardware.assigned_location = undefined;
    hardware.checkout_to_type = undefined;
    const result = convertHardwareToEditData(hardware as IHardwareResponse);
    expect(result.model).toEqual({ id: 0, name: "" });
    expect(result.status_label).toEqual({
      id: 0,
      name: "",
      status_type: "",
      status_meta: "",
    });
    expect(result.category).toEqual({ id: 0, name: "" });
    expect(result.supplier).toEqual({ id: 0, name: "" });
    expect(result.manufacturer).toEqual({ id: 0, name: "" });
    expect(result.location).toEqual({ id: 0, name: "" });
    expect(result.rtd_location).toEqual({ id: 0, name: "" });
    expect(result.assigned_to).toEqual({
      id: 0,
      name: "",
      username: "",
      last_name: "",
      first_name: "",
    });
    expect(result.webhook).toBeUndefined();
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
    expect(result.startRentalDate).toEqual({ date: "", formatted: "" });
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
    expect(result.warranty_expires).toEqual({ date: "", formatted: "" });
    expect(result.expected_checkin).toEqual({ date: "", formatted: "" });
    expect(result.last_checkout).toEqual({ date: "", formatted: "" });
    expect(result.checkin_at).toEqual({ date: "", formatted: "" });
    expect(result.created_at).toEqual({ datetime: "", formatted: "" });
    expect(result.updated_at).toEqual({ datetime: "", formatted: "" });
    expect(result.assigned_location).toEqual({ id: 0, name: "" });
    expect(result.checkout_to_type).toEqual({
      assigned_user: 0,
      assigned_asset: "",
      assigned_location: { id: 0, name: "" },
    });
  });

  it("should handle webhook as wrong type", () => {
    const hardware = { ...baseHardware, webhook: "not-object" as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.webhook).toEqual("not-object");
  });

  it("should handle manufacturer as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).manufacturer;
    const result = convertHardwareToEditData(hardware);
    expect(result.manufacturer).toEqual({ id: 0, name: "" });
  });
  it("should handle webhook as null", () => {
    const hardware = { ...baseHardware, webhook: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.webhook).toBeUndefined();
  });

  it("should handle webhook as missing", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).webhook;
    const result = convertHardwareToEditData(hardware);
    expect(result.webhook).toBeUndefined();
  });

  it("should handle maintenance_date as null", () => {
    const hardware = { ...baseHardware, maintenance_date: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
  });

  it("should handle maintenance_date as missing", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).maintenance_date;
    const result = convertHardwareToEditData(hardware);
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
  });

  it("should handle maintenance_cycle as missing", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).maintenance_cycle;
    const result = convertHardwareToEditData(hardware);
    expect(result.maintenance_cycle).toBeUndefined();
  });

  it("should handle isCustomerRenting as missing", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).isCustomerRenting;
    const result = convertHardwareToEditData(hardware);
    expect(result.isCustomerRenting).toBe(false);
  });

  it("should handle startRentalDate as null", () => {
    const hardware = { ...baseHardware, startRentalDate: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.startRentalDate).toEqual({ date: "", formatted: "" });
  });

  it("should handle startRentalDate as missing", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).startRentalDate;
    const result = convertHardwareToEditData(hardware);
    expect(result.startRentalDate).toEqual({ date: "", formatted: "" });
  });
  it("should handle model as empty object", () => {
    const hardware = { ...baseHardware, model: {} as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.model).toEqual({ id: 0, name: "" });
  });

  it("should handle status_label as empty object", () => {
    const hardware = { ...baseHardware, status_label: {} as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.status_label).toEqual({
      id: 0,
      name: "",
      status_type: "",
      status_meta: "",
    });
  });

  it("should handle category as empty object", () => {
    const hardware = { ...baseHardware, category: {} as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.category).toEqual({ id: 0, name: "" });
  });

  it("should handle purchase_date as empty object", () => {
    const hardware = { ...baseHardware, purchase_date: {} as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
  });

  it("should handle maintenance_date as empty object", () => {
    const hardware = { ...baseHardware, maintenance_date: {} as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.maintenance_date).toEqual({ date: "", formatted: "" });
  });

  it("should handle warranty_expires as empty object", () => {
    const hardware = { ...baseHardware, warranty_expires: {} as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.warranty_expires).toEqual({ date: "", formatted: "" });
  });

  it("should handle isCustomerRenting as true", () => {
    const hardware = { ...baseHardware, isCustomerRenting: true };
    const result = convertHardwareToEditData(hardware);
    expect(result.isCustomerRenting).toBe(true);
  });

  it("should handle isCustomerRenting as false", () => {
    const hardware = { ...baseHardware, isCustomerRenting: false };
    const result = convertHardwareToEditData(hardware);
    expect(result.isCustomerRenting).toBe(false);
  });

  it("should handle webhook as empty object", () => {
    const hardware = { ...baseHardware, webhook: {} as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.webhook).toEqual({ id: undefined, name: undefined });
  });
});

describe("convertHardwareToEditData additional tests", () => {
  it("should handle serial as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).serial;
    const result = convertHardwareToEditData(hardware);
    expect(result.serial).toBe("");
  });

  it("should handle model as null", () => {
    const hardware = { ...baseHardware, model: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.model).toEqual({ id: 0, name: "" });
  });

  it("should handle status_label as null", () => {
    const hardware = { ...baseHardware, status_label: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.status_label).toEqual({
      id: 0,
      name: "",
      status_type: "",
      status_meta: "",
    });
  });

  it("should handle category as null", () => {
    const hardware = { ...baseHardware, category: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.category).toEqual({ id: 0, name: "" });
  });

  it("should handle purchase_date as null", () => {
    const hardware = { ...baseHardware, purchase_date: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
  });

  it("should handle webhook as null", () => {
    const hardware = { ...baseHardware, webhook: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.webhook).toBeUndefined();
  });

  it("should handle startRentalDate as null", () => {
    const hardware = { ...baseHardware, startRentalDate: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.startRentalDate).toEqual({ date: "", formatted: "" });
  });

  it("should handle assigned_to as null", () => {
    const hardware = { ...baseHardware, assigned_to: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.assigned_to).toEqual({
      id: 0,
      name: "",
      username: "",
      last_name: "",
      first_name: "",
    });
  });

  it("should handle checkout_to_type as null", () => {
    const hardware = { ...baseHardware, checkout_to_type: null as any };
    const result = convertHardwareToEditData(hardware);
    expect(result.checkout_to_type).toEqual({
      assigned_user: 0,
      assigned_asset: "",
      assigned_location: { id: 0, name: "" },
    });
  });
});

describe("additional branch coverage for convertHardwareToEditData", () => {
  it("should handle model as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).model;
    const result = convertHardwareToEditData(hardware);
    expect(result.model).toEqual({ id: 0, name: "" });
  });

  it("should handle model_number as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).order_number;
    const result = convertHardwareToEditData(hardware);
    expect(result.model_number).toBeUndefined();
  });

  it("should handle status_label as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).status_label;
    const result = convertHardwareToEditData(hardware);
    expect(result.status_label).toEqual({
      id: 0,
      name: "",
      status_type: "",
      status_meta: "",
    });
  });

  it("should handle category as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).category;
    const result = convertHardwareToEditData(hardware);
    expect(result.category).toEqual({ id: 0, name: "" });
  });

  it("should handle purchase_date as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).purchase_date;
    const result = convertHardwareToEditData(hardware);
    expect(result.purchase_date).toEqual({ date: "", formatted: "" });
  });

  it("should handle webhook as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).webhook;
    const result = convertHardwareToEditData(hardware);
    expect(result.webhook).toBeUndefined();
  });

  it("should handle startRentalDate as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).startRentalDate;
    const result = convertHardwareToEditData(hardware);
    expect(result.startRentalDate).toEqual({ date: "", formatted: "" });
  });

  it("should handle assigned_to as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).assigned_to;
    const result = convertHardwareToEditData(hardware);
    expect(result.assigned_to).toEqual({
      id: 0,
      name: "",
      username: "",
      last_name: "",
      first_name: "",
    });
  });

  it("should handle checkout_to_type as undefined", () => {
    const hardware = { ...baseHardware };
    delete (hardware as any).checkout_to_type;
    const result = convertHardwareToEditData(hardware);
    expect(result.checkout_to_type).toEqual({
      assigned_user: 0,
      assigned_asset: "",
      assigned_location: { id: 0, name: "" },
    });
  });
});
