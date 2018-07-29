const { ratesParser, separateAppliancesByType } = require("./helpers");

module.exports = class Schedule {
  constructor(input) {
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
    this.rates = ratesParser({ rates });

    this.MODE_RATES = {
      day: this.getModeRates(this.MODES.day),
      night: this.getModeRates(this.MODES.night)
    };

    //
    // Divide appliances into
    // Realtime appliances - must run 24/24
    // Schedulable appliances - can be turned off and on
    //
    const {
      schedulableAppliances,
      realTimeAppliances
    } = separateAppliancesByType({
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
    const realTimeAppliancesArray = this.realTimeAppliances.map(
      appliance => appliance.id
    );

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
        throw new Error(
          "Hourly energy consumption should not exceed max available energy"
        );
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
    return scheduledDevices.reduce(
      (acc, device) => acc + devices.get(device).power,
      0
    );
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
          (this.rates[i] * this.devicesMap.get(this.schedule[i][j]).power) /
          1000;
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
    const availableSlot = this.findAvailableSlot(
      rates,
      appliance.power,
      appliance.duration
    );

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
    const totalExpensePerCycle = new Array(24).fill(Infinity);

    for (let i = 0; i < 24; i += 1) {
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
      }
    }

    // return the time slot for which we have the minimum cost
    return totalExpensePerCycle.indexOf(Math.min(...totalExpensePerCycle));
  }

  /**
   *
   * Main function
   *
   */
  createSchedule() {
    this.schedulableAppliances.forEach(appliance => {
      this.scheduleAppliance(appliance);
    });

    const consumedEnergy = this.calculateTotalValueConsummed();
    return { schedule: this.schedule, consumedEnergy };
  }
};
