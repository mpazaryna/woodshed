Deno.test("example test", () => {
    const result = 1 + 1;
    if (result !== 2) {
        throw new Error("Test failed: 1 + 1 should equal 2");
    }
});
