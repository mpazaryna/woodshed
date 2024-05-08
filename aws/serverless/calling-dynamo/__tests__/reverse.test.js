import * as lib from "../src/ReverseString";

test("hello", () => {
  expect(lib.reverseString("hello")).toBe("olleh");
});

test("matt", () => {
  expect(lib.reverseString("matt")).not.toBe("matt");
});
