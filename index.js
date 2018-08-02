class Schedule {
  constructor() {
    this.init = this.init.bind(this);
    this.ratesParser = this.ratesParser.bind(this);
    this.separateAppliancesByType = this.separateAppliancesByType.bind(this);
    this.getModeRates = this.getModeRates.bind(this);
    this.mapHourlyEnergyConsumption = this.mapHourlyEnergyConsumption.bind(this);
    this.calculateHourlyEnergyConsumption = this.calculateHourlyEnergyConsumption.bind(this);
    this.sortSchedulableAppliancesByPowerDesc = this.sortSchedulableAppliancesByPowerDesc.bind(
      this
    );
    this.calculateTotalValueConsummed = this.calculateTotalValueConsummed.bind(this);
    this.scheduleAppliance = this.scheduleAppliance.bind(this);
    this.findAvailableSlot = this.findAvailableSlot.bind(this);
  }

  init(input) {
    //
    // Modes:
    // 1 means that an appliance can run at the given time of day
    // Infinity is assigned for convenience (appliance can not be turned on at this hour)
    //
    this.MODES = {
      day: [
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        Infinity,
        Infinity,
        Infinity
      ],
      night: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        Infinity,
        1,
        1,
        1
      ]
    };

    const { rates, devices } = input;

    //
    // Convert into an array of rates
    //
    this.rates = this.ratesParser({ rates });

    this.MODE_RATES = {
      day: this.getModeRates(this.MODES.day),
      night: this.getModeRates(this.MODES.night)
    };

    //
    // Divide appliances into
    // Realtime appliances - must run 24/24
    // Schedulable appliances - can be turned off and on
    //
    const { schedulableAppliances, realTimeAppliances } = this.separateAppliancesByType({
      devices
    });

    this.realTimeAppliances = realTimeAppliances;
    this.schedulableAppliances = schedulableAppliances;

    //
    // A convenience Map to simplify calculations
    // A simple Object could be used
    //
    this.devicesMap = new Map();
    devices.forEach(device => {
      this.devicesMap.set(device.id, device);
    });

    //
    // Sort schedulable appliances in the descending order so that we start
    // assigning the least expenses time slots to the most consumming appliances
    //
    this.sortSchedulableAppliancesByPowerDesc();

    //
    // Maximum power consumption constraint. Sum of power of all running appliances
    // at a given time slot must not exceed this value
    //
    this.maxPower = input.maxPower;

    //
    // Real time appliances must always run regardless of the cost
    //
    const realTimeAppliancesArray = this.realTimeAppliances.map(appliance => appliance.id);

    //
    // Our initial schedule
    // All real time appliances are already scheduled to run all day
    //
    this.schedule = {
      0: [...realTimeAppliancesArray],
      1: [...realTimeAppliancesArray],
      2: [...realTimeAppliancesArray],
      3: [...realTimeAppliancesArray],
      4: [...realTimeAppliancesArray],
      5: [...realTimeAppliancesArray],
      6: [...realTimeAppliancesArray],
      7: [...realTimeAppliancesArray],
      8: [...realTimeAppliancesArray],
      9: [...realTimeAppliancesArray],
      10: [...realTimeAppliancesArray],
      11: [...realTimeAppliancesArray],
      12: [...realTimeAppliancesArray],
      13: [...realTimeAppliancesArray],
      14: [...realTimeAppliancesArray],
      15: [...realTimeAppliancesArray],
      16: [...realTimeAppliancesArray],
      17: [...realTimeAppliancesArray],
      18: [...realTimeAppliancesArray],
      19: [...realTimeAppliancesArray],
      20: [...realTimeAppliancesArray],
      21: [...realTimeAppliancesArray],
      22: [...realTimeAppliancesArray],
      23: [...realTimeAppliancesArray]
    };

    //
    // A convenience cache Object that keeps track of the current
    // energy consumption for each given slot
    //
    this.hourlyConsumption = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      21: 0,
      22: 0,
      23: 0
    };

    //
    // Calculate initial values
    //
    this.mapHourlyEnergyConsumption();
  }

  /**
   *
   * Converts energy rates provided in objecto form
   * to an array of length 24
   * in which each index represents an hour of the day
   *
   * @param {Object} input
   * @param {Object[]} input.rates[]      - Information of energy tariffs for day periods
   * @param {number} input.rates[].from   - Starting time
   * @param {number} input.rates[].to     - End time
   * @param {number} input.rates[].value  - Energy cost
   * @returns {number[]}                  - Returns an array of lenght 24 of hourly rates
   *
   */
  ratesParser({ rates = [] }) {
    if (rates.length === 0) throw new Error("No rates supplied");
    const output = new Array(24).fill(undefined);
    rates.forEach(rate => {
      let i = rate.from;
      do {
        output[i] = rate.value;
        i += 1;
        if (i === 24) i = 0;
      } while (i < rate.to);
    });

    // Throw an error if at least for one time period the rate is null, undefined or 0
    if (output.some(value => !value)) {
      throw new Error("Invalid rates supplied");
    }

    return output;
  }

  separateAppliancesByType({ devices }) {
    const realTimeAppliances = devices.filter(device => device.duration === 24);
    const schedulableAppliances = devices.filter(device => device.duration !== 24);
    return { realTimeAppliances, schedulableAppliances };
  }

  /**
   * Create a mode specific energy rates
   * @param {number[]} hours - an array of 1 and Infinity
   */
  getModeRates(hours) {
    const rates = [...this.rates];
    return rates.map((rate, index) => rate * hours[index]);
  }

  /**
   * For each time slot calculate total energy consumption
   */
  mapHourlyEnergyConsumption() {
    for (let i = 0; i < 24; i += 1) {
      this.hourlyConsumption[i] = this.calculateHourlyEnergyConsumption(
        this.schedule[i],
        this.devicesMap
      );
      if (this.hourlyConsumption[i] > this.maxPower) {
        throw new Error("Hourly energy consumption should not exceed max available energy");
      }
    }
  }

  /**
   *
   * Calcualtes energy consumption for a given time slot
   *
   * @param {String[]} scheduledDevices - list of scheduled devices
   * @param {Object[]} devices - array of devices
   * @param {power} devices[].power - device's power consumption
   *
   */
  calculateHourlyEnergyConsumption(scheduledDevices, devices) {
    return scheduledDevices.reduce((acc, device) => acc + devices.get(device).power, 0);
  }

  sortSchedulableAppliancesByPowerDesc() {
    this.schedulableAppliances.sort((appA, appB) => appB.power - appA.power);
  }

  calculateTotalValueConsummed() {
    let value = 0;
    const devices = {};
    for (let i = 0; i < 24; i += 1) {
      for (let j = 0; j < this.schedule[i].length; j += 1) {
        value += this.rates[i] * this.devicesMap.get(this.schedule[i][j]).power;
        if (!devices[this.schedule[i][j]]) devices[this.schedule[i][j]] = 0;
        devices[this.schedule[i][j]] +=
          (this.rates[i] * this.devicesMap.get(this.schedule[i][j]).power) / 1000;
        devices[this.schedule[i][j]] = Number.parseFloat(
          devices[this.schedule[i][j]].toPrecision(10)
        );
      }
    }

    return {
      value: Number.parseFloat((value / 1000).toPrecision(10)),
      devices
    };
  }

  /**
   *
   * Find the best time slot for the appliance
   *
   * @param {Object} appliance
   * @param {string} appliance.mode - if not undefined, specifies the time period at which
   * the appliance must be turned on. Takes 'day' of 'night'.
   * @param {number} appliance.power - power consummed by the appliance
   * @param {number} appliance.duration - appliance run cycle
   *
   */
  scheduleAppliance(appliance) {
    let { rates } = this;
    if (appliance.mode) rates = this.MODE_RATES[appliance.mode];
    const availableSlot = this.findAvailableSlot(rates, appliance.power, appliance.duration);

    this.updateSchedule(availableSlot, appliance);
  }

  /**
   *
   * Update the schedule. Update power consumption cache.
   *
   * @param {number} slot - time slot
   * @param {Object} appliance
   */
  updateSchedule(slot, appliance) {
    for (let i = 0; i < appliance.duration; i += 1) {
      let k = slot + i;
      if (k > 23) k = slot + i - 23;
      this.schedule[k] = this.schedule[k].concat(appliance.id);
      this.hourlyConsumption[k] += appliance.power;
    }
  }

  /**
   *
   * Finds the least expensive time slot under constraints
   *
   * @param {number[]} rates - array of hourly rates. Infinity means that the appliance
   * cannot be turned on at this time
   * @param {number} power - appliance's power consumption
   * @param {number} duration - appliance's run cycle
   */
  findAvailableSlot(rates, power, duration) {
    // Keep track of total expense at each given start time
    const totalExpensePerCycle = new Array(24).fill(undefined);
    const min = { index: 0, value: Infinity };

    for (let i = 0; i < 24; i += 1) {
      if (totalExpensePerCycle[i] !== undefined) continue;
      totalExpensePerCycle[i] = 0;

      for (let j = 0; j < duration; j += 1) {
        let k = i + j;
        if (k > 23) {
          k = i + j - 24;
        }

        // Check for total energy available;
        // if at a given time slot we do not have enough spare power,
        // assign Infinity, break the iteration: the appliance cannot be scheduled
        // at this time slot.
        if (this.hourlyConsumption[k] + power > this.maxPower) {
          totalExpensePerCycle[i] = Infinity;
          break;
        }

        // Calculate total expense per cycle at a given start time
        totalExpensePerCycle[i] += rates[k] * power;

        if (totalExpensePerCycle[i] < min.value) {
          min.index = i;
          min.value = totalExpensePerCycle[i];
        }
      }
    }

    // return the time slot for which we have the minimum cost
    // TODO: need to handle situations where no slots are available:
    //       1. Try to reschedule other appliances;
    //       2. If not possible throw an error?
    // return totalExpensePerCycle.indexOf(Math.min(...totalExpensePerCycle));

    if (min.value !== Infinity) {
      return min.index;
    }
    throw new Error("Unable to make a schedule with given input parameters");
  }

  /**
   *
   * Main function
   *
   */
  createSchedule(input) {
    this.init(input);
    this.schedulableAppliances.forEach(appliance => {
      this.scheduleAppliance(appliance);
    });

    const consumedEnergy = this.calculateTotalValueConsummed();
    return { schedule: this.schedule, consumedEnergy };
  }
}

const scheduleInstance = new Schedule();

module.exports = scheduleInstance;
