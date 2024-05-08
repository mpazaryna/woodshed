import { hashPassword, validatePassword } from "./password";

const PASSWORD = "1234";

const VALUES = {
  hash:
    "2c6dec7c357784de002795c9b771f5e50d1219fc2c3f1ad96f732f1ae532a666a49b3a732d6a3cf20ff734b21784b5c174c808ce5ce18a08a0179deec792d883",
  salt: "a25354844920ff905464891c10a7490a",
  string: "1234",
  wrongString: "admin1234",
};

describe("hashPassword", () => {
  test("hashPassword returns an object with hash", () => {
    const result = hashPassword(PASSWORD);
    expect(result).toHaveProperty("hash");
  });

  test("hashPassword returns and object with salt", () => {
    const result = hashPassword(PASSWORD);
    expect(result).toHaveProperty("salt");
  });
});

describe("validatePassword", () => {
  test("with correct password", () => {
    expect(validatePassword(VALUES.string, VALUES.salt, VALUES.hash)).toBe(
      true
    );
  });

  test("with wrong password", () => {
    expect(validatePassword(VALUES.wrongString, VALUES.salt, VALUES.hash)).toBe(
      false
    );
  });
});
