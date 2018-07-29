function ratesParser({ rates = [] }) {
  if (rates.length === 0) throw new Error("No rates supplied");
  return [];
}

module.exports = { ratesParser: ratesParser };
