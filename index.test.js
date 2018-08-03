const scheduleInstance = require("./index");

describe.only("Schedule:", () => {
  let input;
  let result;
  const output = {
    schedule: {
      0: [
        "02DDD23A85DADDD71198305330CC386D",
        "1E6276CC231716FE8EE8BC908486D41E",
        "F972B82BA56A70CC579945773B6866FB"
      ],
      1: [
        "02DDD23A85DADDD71198305330CC386D",
        "1E6276CC231716FE8EE8BC908486D41E",
        "F972B82BA56A70CC579945773B6866FB"
      ],
      2: [
        "02DDD23A85DADDD71198305330CC386D",
        "1E6276CC231716FE8EE8BC908486D41E",
        "F972B82BA56A70CC579945773B6866FB"
      ],
      3: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      4: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      5: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      6: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      7: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      8: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      9: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      10: [
        "02DDD23A85DADDD71198305330CC386D",
        "1E6276CC231716FE8EE8BC908486D41E",
        "C515D887EDBBE669B2FDAC62F571E9E9"
      ],
      11: [
        "02DDD23A85DADDD71198305330CC386D",
        "1E6276CC231716FE8EE8BC908486D41E",
        "C515D887EDBBE669B2FDAC62F571E9E9"
      ],
      12: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      13: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      14: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      15: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      16: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      17: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      18: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      19: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      20: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      21: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      22: ["02DDD23A85DADDD71198305330CC386D", "1E6276CC231716FE8EE8BC908486D41E"],
      23: [
        "02DDD23A85DADDD71198305330CC386D",
        "1E6276CC231716FE8EE8BC908486D41E",
        "7D9DC84AD110500D284B33C82FE6E85E"
      ]
    },
    consumedEnergy: {
      value: 38.939,
      devices: {
        F972B82BA56A70CC579945773B6866FB: 5.1015,
        C515D887EDBBE669B2FDAC62F571E9E9: 21.52,
        "02DDD23A85DADDD71198305330CC386D": 5.398,
        "1E6276CC231716FE8EE8BC908486D41E": 5.398,
        "7D9DC84AD110500D284B33C82FE6E85E": 1.5215
      }
    }
  };
  beforeEach(() => {
    input = {
      devices: [
        {
          id: "F972B82BA56A70CC579945773B6866FB",
          name: "Посудомоечная машина",
          power: 950,
          duration: 3,
          mode: "night"
        },
        {
          id: "C515D887EDBBE669B2FDAC62F571E9E9",
          name: "Духовка",
          power: 2000,
          duration: 2,
          mode: "day"
        },
        {
          id: "02DDD23A85DADDD71198305330CC386D",
          name: "Холодильник",
          power: 50,
          duration: 24
        },
        {
          id: "1E6276CC231716FE8EE8BC908486D41E",
          name: "Термостат",
          power: 50,
          duration: 24
        },
        {
          id: "7D9DC84AD110500D284B33C82FE6E85E",
          name: "Кондиционер",
          power: 850,
          duration: 1
        }
      ],
      rates: [
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
      ],
      maxPower: 2100
    };

    result = scheduleInstance.createSchedule(input);
  });

  test("should parse rates to an array", () => {
    expect(scheduleInstance.rates.length).toBe(24);
  });
  test("schedule instance variable should be an object with 24 keys", () => {
    expect(Object.keys(scheduleInstance.schedule).length).toBe(24);
  });

  test("real time appliances must be always turned on", () => {
    Object.values(result.schedule).forEach(timeSlot => {
      expect(timeSlot.length).toBeGreaterThanOrEqual(2);
    });
  });

  test("energy consumption at each given slot should not exceed total energy available", () => {
    expect(scheduleInstance.maxPower).toEqual(input.maxPower);
    Object.values(result.schedule).forEach(timeSlot => {
      expect(
        scheduleInstance.calculateHourlyEnergyConsumption(timeSlot, scheduleInstance.devicesMap)
      ).toBeLessThanOrEqual(scheduleInstance.maxPower);
    });
  });

  test("consumedEnergy should equal values in output example", () => {
    expect(result.consumedEnergy).toEqual(output.consumedEnergy);
  });

  test("should place appliances to the least expensive slot", () => {
    let inputMock = {
      devices: [
        {
          id: "F972B82BA56A70CC579945773B6866FB",
          name: "Посудомоечная машина",
          power: 950,
          duration: 1
        }
      ],
      rates: [{ from: 0, to: 1, value: 1 }, { from: 1, to: 24, value: 2 }],
      maxPower: 2100
    };

    expect(scheduleInstance.createSchedule(inputMock).schedule[0].length).toEqual(1);

    inputMock = {
      devices: [
        {
          id: "F972B82BA56A70CC579945773B6866FB",
          name: "Посудомоечная машина",
          power: 950,
          duration: 1
        }
      ],
      rates: [{ from: 1, to: 2, value: 1 }, { from: 2, to: 1, value: 2 }],
      maxPower: 2100
    };

    expect(scheduleInstance.createSchedule(inputMock).schedule[1].length).toEqual(1);

    inputMock = {
      devices: [
        {
          id: "F972B82BA56A70CC579945773B6866FB",
          name: "Посудомоечная машина",
          power: 2000,
          duration: 1
        },
        {
          id: "7D9DC84AD110500D284B33C82FE6E85E",
          name: "Кондиционер",
          power: 850,
          duration: 1
        }
      ],
      rates: [
        { from: 1, to: 2, value: 1 },
        { from: 2, to: 23, value: 2 },
        { from: 23, to: 24, value: 1 },
        { from: 24, to: 1, value: 2 }
      ],
      maxPower: 2100
    };

    const testResult = scheduleInstance.createSchedule(inputMock);

    expect(testResult.schedule[1].length).toEqual(1);
    expect(testResult.schedule[23].length).toEqual(1);
  });

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
        scheduleInstance.ratesParser({ rates: [] });
      }).toThrow("No rates supplied");
    });

    test("should return an array of length 24", () => {
      expect(scheduleInstance.ratesParser({ rates }).length).toBe(24);
    });

    test("should return an array filled with 1", () => {
      const inputMock = [{ from: 23, to: 5, value: 1 }, { from: 5, to: 23, value: 1 }];
      expect(scheduleInstance.ratesParser({ rates: inputMock })).toEqual(new Array(24).fill(1));
    });

    test("should throw an error 'Invalid rates supplied' if for at least one time period the rate is undefined", () => {
      const inputMock = [{ from: 23, to: 3, value: 1 }, { from: 5, to: 23, value: 1 }];
      expect(() => {
        scheduleInstance.ratesParser({ rates: inputMock });
      }).toThrow("Invalid rates supplied");
    });

    test("should throw an error 'Invalid rates supplied' if for at least one time period the rate is 0", () => {
      let inputMock = [
        { from: 23, to: 4, value: 1 },
        { from: 4, to: 5, value: 0 },
        { from: 5, to: 23, value: 1 }
      ];
      expect(() => {
        scheduleInstance.ratesParser({ rates: inputMock });
      }).toThrow("Invalid rates supplied");

      inputMock = [{ from: 0, to: 25, value: 1 }];
      expect(() => {
        scheduleInstance.ratesParser({ rates: inputMock });
      }).toThrow("Invalid rates supplied");
    });
    test("output should equal the expected array", () => {
      expect(scheduleInstance.ratesParser({ rates })).toEqual(expectedOutput);
    });

    test("should fill array correctly with various input parameters", () => {
      let inputMock = [{ from: 0, to: 24, value: 1 }];
      let outputMock = scheduleInstance.ratesParser({ rates: inputMock });

      expect(outputMock.length).toEqual(24);
      expect(outputMock.every(v => v === 1)).toBe(true);

      inputMock = [{ from: 15, to: 15, value: 1 }];
      outputMock = scheduleInstance.ratesParser({ rates: inputMock });

      expect(outputMock.length).toEqual(24);
      expect(outputMock.every(v => v === 1)).toBe(true);

      inputMock = [{ from: 0, to: 1, value: 1 }, { from: 1, to: 24, value: 2 }];
      outputMock = scheduleInstance.ratesParser({ rates: inputMock });

      expect(outputMock.length).toEqual(24);
      expect(outputMock.indexOf(1) === outputMock.lastIndexOf(1)).toBe(true);
    });
  });
});
