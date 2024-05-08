const convert = require('./convert')

test('converts 34550122DF', () => {
  expect(convert("34550122DF")).toBe("52.85.1.34.223")
})

test('converts 0a809180', () => {
  expect(convert("0a809180")).toBe("10.128.145.128")
})



