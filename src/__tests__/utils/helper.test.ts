import { describe, expect, test } from "@jest/globals";
import { sum } from "utils/users";

describe("helper module", () => {
  test("sum", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
