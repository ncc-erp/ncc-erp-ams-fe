import { getPermissionsUser, sum } from "utils/users";
import { AccessType } from "constants/permissions";

jest.mock("src/i18n", () => ({
  t: (key: string) => key,
}));

describe("getPermissionsUser", () => {
  it("returns admin label when admin is allowed", () => {
    expect(getPermissionsUser({ admin: AccessType.allow })).toBe(
      "user.label.title.admin"
    );
  });

  it("returns branchadmin label when branchadmin is allowed", () => {
    expect(getPermissionsUser({ branchadmin: AccessType.allow })).toBe(
      "user.label.title.branchadmin"
    );
  });

  it("returns superuser label when superuser is allowed", () => {
    expect(getPermissionsUser({ superuser: AccessType.allow })).toBe(
      "user.label.title.superuser"
    );
  });

  it("returns empty string when no permission is allowed", () => {
    expect(getPermissionsUser({ admin: AccessType.refuse })).toBe("");
    expect(getPermissionsUser({ branchadmin: AccessType.refuse })).toBe("");
    expect(getPermissionsUser({ superuser: AccessType.refuse })).toBe("");
    expect(getPermissionsUser({})).toBe("");
    expect(getPermissionsUser(null)).toBe("");
    expect(getPermissionsUser(undefined)).toBe("");
  });
});

describe("sum", () => {
  it("returns sum of two numbers", () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
    expect(sum(0, 0)).toBe(0);
  });
});
