import * as hello from "../src/endpoints/hello";
import * as calc from "../src/endpoints/calc";

test("hello", async () => {
  const event = "event";
  const context = "context";
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };
  await hello.handler(event, context, callback);
});

test("calc", async () => {
  const event = "event";
  const context = "context";
  const callback = (error, response) => {
    expect(response.statusCode).toEqual(200);
    expect(typeof response.body).toBe("string");
  };
  await calc.handler(event, context, callback);
});
