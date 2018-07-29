const { ratesParser } = require("./helpers");

describe("RatesParser: helper function", () => {
  test("passing an empty array should throw an error", () => {
    expect(() => {
      ratesParser({ rates: [] });
    }).toThrow("No rates supplied");
  });
});
