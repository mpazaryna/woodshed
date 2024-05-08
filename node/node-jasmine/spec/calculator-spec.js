var calculator = require("../calculator");
 
describe("multiplication", function () {
  it("should multiply 2 and 3", function () {
    var product = calculator.multiply(2, 3);
    expect(product).toBe(6);
  });
  it("should multiply 3 and 5", function () {
    var product = calculator.multiply(3, 5);
    expect(product).toBe(15);
  });  
  it("should subtract 5 from 10", function () {
    var product = calculator.subtract(10, 5);
    expect(product).toBe(5);
  });     
  it("should subtract 10 from 5", function () {
    var product = calculator.subtract(5, 10);
    expect(product).toBe(-5);
  });     
}); 