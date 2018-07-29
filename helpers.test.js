const { ratesParser, dotProduct } = require("./helpers");

describe("ratesParser:", () => {
  let rates;
  const expectedOutput = [
    1.79,
    1.79,
    1.79,
    1.79,
    1.79,
    1.79,
    1.79,
    6.46,
    6.46,
    6.46,
    5.38,
    5.38,
    5.38,
    5.38,
    5.38,
    5.38,
    5.38,
    6.46,
    6.46,
    6.46,
    6.46,
    5.38,
    5.38,
    1.79
  ];
  beforeEach(() => {
    rates = [
      {
        from: 7,
        to: 10,
        value: 6.46
      },
      {
        from: 10,
        to: 17,
        value: 5.38
      },
      {
        from: 17,
        to: 21,
        value: 6.46
      },
      {
        from: 21,
        to: 23,
        value: 5.38
      },
      {
        from: 23,
        to: 7,
        value: 1.79
      }
    ];
  });

  test("should throw an error if passed en empty array as argument", () => {
    expect(() => {
      ratesParser({ rates: [] });
    }).toThrow("No rates supplied");
  });

  test("should return an array of length 24", () => {
    expect(ratesParser({ rates }).length).toBe(24);
  });

  test("should return an array filled with 1", () => {
    const input = [
      { from: 23, to: 5, value: 1 },
      { from: 5, to: 23, value: 1 }
    ];
    expect(ratesParser({ rates: input })).toEqual(new Array(24).fill(1));
  });

  test("should throw an error 'Invalid rates supplied' if for at least one time period the rate is undefined", () => {
    const input = [
      { from: 23, to: 3, value: 1 },
      { from: 5, to: 23, value: 1 }
    ];
    expect(() => {
      ratesParser({ rates: input });
    }).toThrow("Invalid rates supplied");
  });

  test("should throw an error 'Invalid rates supplied' if for at least one time period the rate is 0", () => {
    const input = [
      { from: 23, to: 4, value: 1 },
      { from: 4, to: 5, value: 0 },
      { from: 5, to: 23, value: 1 }
    ];
    expect(() => {
      ratesParser({ rates: input });
    }).toThrow("Invalid rates supplied");
  });

  test("output should equal the expected array", () => {
    expect(ratesParser({ rates })).toEqual(expectedOutput);
  });
});

describe("dotProduct", () => {
  test("should throw 'Null input' if at least one of the arguments is missing or has 0 length", () => {
    expect(() => {
      dotProduct();
    }).toThrow("Null input");

    expect(() => {
      dotProduct([1], []);
    }).toThrow("Null input");

    expect(() => {
      dotProduct(null, [1, 2, 3]);
    }).toThrow("Null input");
  });

  test("should throw 'Invalid input' if arguments have different lengths", () => {
    expect(() => {
      dotProduct([1], [1, 2, 3]);
    }).toThrow("Invalid input");
  });

  test("should return dot product of two vectors", () => {
    let v1 = [1, 1, 1];
    let v2 = [1, 1, 1];
    expect(dotProduct(v1, v2)).toEqual(3);

    v1 = [1, 3, -5];
    v2 = [4, -2, -1];
    expect(dotProduct(v1, v2)).toEqual(3);
  });
});
