// backend/data/syntheticFreightData.js
// OceanCharter AI - 730 Days High-Fidelity Synthetic Freight Time-Series Data

function generate730DaysData() {
  const dataset = [];
  const origins = ['Gladstone', 'Newcastle', 'Hay Point', 'Banjarmasin', 'Maputo', 'Baltimore'];
  const destinations = ['Paradip', 'Haldia', 'Dhamra', 'Visakhapatnam', 'Gangavaram', 'Gopalpur', 'Chennai', 'Kamarajar'];
  const vesselClasses = ['CAPESIZE', 'PANAMAX', 'SUPRAMAX', 'HANDYSIZE'];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 730); // 2 full years of daily records

  // Base parameters
  const baseRates = {
    CAPESIZE: 14.50,
    PANAMAX: 18.20,
    SUPRAMAX: 22.40,
    HANDYSIZE: 26.80
  };

  const routeMultiplier = {
    Gladstone: 1.0,
    Newcastle: 1.05,
    'Hay Point': 1.02,
    Banjarmasin: 0.62,
    Maputo: 0.92,
    Baltimore: 1.85
  };

  // We simulate continuous price walks for each vessel class over 730 days
  const vesselState = {
    CAPESIZE: 14.50,
    PANAMAX: 18.20,
    SUPRAMAX: 22.40,
    HANDYSIZE: 26.80
  };

  for (let day = 0; day <= 730; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + day);
    const dateStr = currentDate.toISOString().split('T')[0];

    // Market Macro Events Injection
    let eventNote = null;
    let macroEventFactor = 1.0;
    let fuelBase = 620;
    let bdiBase = 1850;
    let weatherRisk = 18;
    let congestionIdx = 22;

    // Day 120 - 150: Global Fuel Spike & Bunker Shock
    if (day >= 120 && day <= 150) {
      macroEventFactor = 1.18;
      fuelBase = 840;
      eventNote = 'Global Bunker Fuel Price Shock & Refinery Maintenance';
    }
    // Day 240 - 280: Southwest Monsoon Surge on East Coast of India
    else if (day >= 240 && day <= 280) {
      weatherRisk = 68;
      congestionIdx = 55;
      eventNote = 'SW Monsoon Wave Surge - Indian Bay of Bengal Ports';
    }
    // Day 365 - 390: Major Tropical Cyclone along Bay of Bengal
    else if (day >= 365 && day <= 390) {
      weatherRisk = 88;
      congestionIdx = 72;
      macroEventFactor = 1.25;
      eventNote = 'Severe Cyclone Warning & Port Berth Closures (Paradip/Vizag)';
    }
    // Day 450 - 480: Global Capesize Tonnage Deficit (Freight Spike)
    else if (day >= 450 && day <= 480) {
      macroEventFactor = 1.35;
      bdiBase = 3200;
      eventNote = 'Severe Atlantic-Pacific Capesize Tonnage Shortage & Port Congestion';
    }
    // Day 580 - 610: Market Correction & Fleet Oversupply
    else if (day >= 580 && day <= 610) {
      macroEventFactor = 0.82;
      bdiBase = 1250;
      eventNote = 'Macro Commodity Correction & Chinese Steel Mill Destocking';
    }
    // Day 700 - 730 (Recent): Steady Bullish Momentum
    else if (day >= 700) {
      macroEventFactor = 1.08;
      eventNote = 'Rising Australian Coking Coal Export Demand & Tight Panamax Fleet';
    }

    // Seasonal cyclicity
    const dayOfYear = day % 365;
    const seasonalSwell = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 1.2;

    vesselClasses.forEach(vc => {
      // Random walk step
      const noise = (Math.random() - 0.48) * 0.45;
      let rate = (baseRates[vc] + seasonalSwell) * macroEventFactor + noise;
      rate = Math.max(7.50, Number(rate.toFixed(2)));
      vesselState[vc] = rate;

      // Key benchmark route: Gladstone -> Paradip
      dataset.push({
        date: currentDate,
        dateString: dateStr,
        origin: 'Gladstone',
        destination: 'Paradip',
        vesselClass: vc,
        cargoType: 'Coking Coal',
        ratePerMT: rate,
        fuelPriceVLSFO: Math.round(fuelBase + (Math.sin(day * 0.1) * 35)),
        marketIndexBDI: Math.round(bdiBase * (rate / baseRates[vc])),
        weatherRiskScore: weatherRisk,
        congestionIndex: congestionIdx,
        eventNote: eventNote,
        dataQuality: 'SIMULATED',
        source: 'OceanCharter AI Synthetic Maritime Time-Series Engine'
      });
    });
  }

  return dataset;
}

module.exports = {
  generate730DaysData
};
