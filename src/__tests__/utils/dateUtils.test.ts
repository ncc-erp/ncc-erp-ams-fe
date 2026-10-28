import { formatDateWithTimeZone } from "utils/dateUtils";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe("formatDateWithTimeZone", () => {
  it("should format valid date string", () => {
    const date = "2024-08-13T10:30:00Z";
    const result = formatDateWithTimeZone(date);
    expect(typeof result).toBe("string");
    expect(result).not.toBe("n/a");
  });

  it("should return 'n/a' for null", () => {
    expect(formatDateWithTimeZone(null)).toBe("n/a");
  });

  it("should return 'n/a' for undefined", () => {
    expect(formatDateWithTimeZone(undefined)).toBe("n/a");
  });

  it("should return 'n/a' for empty string", () => {
    expect(formatDateWithTimeZone("")).toBe("n/a");
  });

  it("should handle invalid date string", () => {
    const result = formatDateWithTimeZone("invalid-date");
    expect(typeof result).toBe("string");
    expect(result).not.toBe("n/a");
  });
});
