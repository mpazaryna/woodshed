var Lib = require("../lib/calculateLib");

test("adds 1 + 2 to equal 3", () => {
  expect(Lib.easySum(1, 2)).toBe(3);
});

test("mods 1 & 2 to not return 3", () => {
  expect(Lib.easyMod(1, 2)).not.toBe(3);
});
