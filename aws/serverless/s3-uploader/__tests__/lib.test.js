import * as lib from "../src/MathLib";

test("sum 1 and 2 equal 3", () => {
  expect(lib.easySum(1, 2)).toBe(3);
});

test("sum 1 and 2 not equal 4", () => {
  expect(lib.easySum(1, 2)).not.toBe(4);
});

test("1 mod 2 to not equal 3", () => {
  expect(lib.easyMod(1, 2)).not.toBe(3);
});

test("9 mod 3 equal 0", () => {
  expect(lib.easyMod(9, 3)).toBe(0);
});
