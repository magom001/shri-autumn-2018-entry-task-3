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
function ratesParser({ rates = [] }) {
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

/**
 *
 * Returns a vector dot product
 *
 * @param {number[]} v1 - Vector 1
 * @param {number[]} v2 - Vector 2
 * @returns {number}
 *
 */
function dotProduct(v1 = [], v2 = []) {
  if (!v1 || !v2 || !v1.length || !v2.length) throw new Error("Null input");
  if (v1.length !== v2.length) throw new Error("Invalid input");
  return v1.reduce((acc, curr, index) => acc + curr * v2[index], 0);
}

function separateAppliancesByType({ devices }) {
  const realTimeAppliances = devices.filter(device => device.duration === 24);
  const schedulableAppliances = devices.filter(
    device => device.duration !== 24
  );
  return { realTimeAppliances, schedulableAppliances };
}

module.exports = { ratesParser, dotProduct, separateAppliancesByType };
