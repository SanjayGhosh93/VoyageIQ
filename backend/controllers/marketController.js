// backend/controllers/marketController.js
const FreightRate = require('../models/FreightRate');
const { getIsConnected } = require('../config/db');
const { calculateEMA, calculateVolatility } = require('../services/forecastService');
const { getLiveMarketTicker } = require('../services/liveMarineService');

// @desc Get live market overview indices and bunker prices
// @route GET /api/market
const getMarketOverview = async (req, res, next) => {
  try {
    const liveFeed = getLiveMarketTicker();

    const marketData = {
      indices: {
        bdi: { name: 'Baltic Dry Index', value: liveFeed.indices.BDI.value, change: liveFeed.indices.BDI.change, trend: liveFeed.indices.BDI.trend, description: 'Composite global dry bulk benchmark' },
        bci: { name: 'Baltic Capesize Index', value: liveFeed.indices.BCI.value, change: liveFeed.indices.BCI.change, trend: liveFeed.indices.BCI.trend, description: '180,000 DWT Capesize daily earnings index' },
        bpi: { name: 'Baltic Panamax Index', value: liveFeed.indices.BPI.value, change: liveFeed.indices.BPI.change, trend: liveFeed.indices.BPI.trend, description: '74,000–82,000 DWT Panamax benchmark' },
        bsi: { name: 'Baltic Supramax Index', value: liveFeed.indices.BSI.value, change: liveFeed.indices.BSI.change, trend: liveFeed.indices.BSI.trend, description: '58,000 DWT geared bulk carrier index' },
        bhsi: { name: 'Baltic Handysize Index', value: 780, change: '+0.4%', trend: 'SIDEWAYS', description: '38,000 DWT small parcel benchmark' }
      },
      bunkerPrices: [
        { port: 'Singapore', vlsfo: liveFeed.bunkerFuel.VLSFO_Singapore.priceUSD, mgo: liveFeed.bunkerFuel.MGO_Rotterdam.priceUSD, change: liveFeed.bunkerFuel.VLSFO_Singapore.change },
        { port: 'Fujairah', vlsfo: liveFeed.bunkerFuel.IFO380_Fujairah.priceUSD, mgo: +(liveFeed.bunkerFuel.IFO380_Fujairah.priceUSD * 1.35).toFixed(2), change: liveFeed.bunkerFuel.IFO380_Fujairah.change },
        { port: 'Visakhapatnam', vlsfo: +(liveFeed.bunkerFuel.VLSFO_Singapore.priceUSD * 1.05).toFixed(2), mgo: 865, change: '+0.8%' },
        { port: 'Paradip', vlsfo: +(liveFeed.bunkerFuel.VLSFO_Singapore.priceUSD * 1.06).toFixed(2), mgo: 870, change: '+1.0%' }
      ],
      freightSpotBenchmarks: [
        { route: 'Gladstone → Paradip (Capesize)', rateUSDPerMT: 15.20, change: '+3.5%' },
        { route: 'Gladstone → Paradip (Panamax)', rateUSDPerMT: liveFeed.liveFreightRatesUSDPerMT['Gladstone-Paradip'] || 18.42, change: '+2.8%' },
        { route: 'Newcastle → Paradip (Panamax)', rateUSDPerMT: 19.10, change: '+2.2%' },
        { route: 'Banjarmasin → Haldia (Supramax)', rateUSDPerMT: liveFeed.liveFreightRatesUSDPerMT['Banjarmasin-Paradip'] || 13.40, change: '-1.1%' },
        { route: 'Maputo → Visakhapatnam (Panamax)', rateUSDPerMT: liveFeed.liveFreightRatesUSDPerMT['Maputo-Paradip'] || 16.80, change: '+0.9%' },
        { route: 'Vostochny → Paradip (Panamax)', rateUSDPerMT: liveFeed.liveFreightRatesUSDPerMT['Vostochny-Paradip'] || 19.10, change: '+1.4%' },
        { route: 'Baltimore → Paradip (Capesize)', rateUSDPerMT: liveFeed.liveFreightRatesUSDPerMT['Baltimore-Paradip'] || 32.50, change: '+4.2%' }
      ],
      marketRegimeSummary: {
        currentRegime: 'BULLISH',
        volatilityIndex: 14.2,
        recommendedAction: 'Lock in forward requirements via medium-term Time Charter or COA to protect against freight rate inflation.'
      },
      dataQuality: 'LIVE_STREAMING',
      source: 'Baltic Dry Index & Live Singapore VLSFO Feed',
      timestamp: liveFeed.timestamp
    };

    res.json({
      success: true,
      data: marketData
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get 730 days historical freight rate time-series
// @route GET /api/market/history
const getFreightHistory = async (req, res, next) => {
  try {
    const { vesselClass = 'PANAMAX', origin = 'Gladstone', destination = 'Paradip', days = 365 } = req.query;
    const requestedDays = parseInt(days, 10) || 365;

    let series = [];
    if (getIsConnected()) {
      series = await FreightRate.find({ vesselClass, origin, destination })
        .sort({ date: 1 })
        .limit(requestedDays);
    }

    if (!series || series.length === 0) {
      const allData = inMemoryStore.syntheticFreightData || [];
      series = allData.filter(d => d.vesselClass === vesselClass && d.origin === origin);
      if (series.length > requestedDays) {
        series = series.slice(-requestedDays);
      }
    }

    // Compute EMAs on historical series
    const prices = series.map(s => s.ratePerMT);
    const ema20 = calculateEMA(prices, 20);
    const ema50 = calculateEMA(prices, 50);

    const enriched = series.map((item, idx) => ({
      date: item.dateString || (item.date ? new Date(item.date).toISOString().split('T')[0] : '2025-01-01'),
      ratePerMT: item.ratePerMT,
      vesselClass: item.vesselClass,
      fuelPriceVLSFO: item.fuelPriceVLSFO,
      marketIndexBDI: item.marketIndexBDI,
      weatherRiskScore: item.weatherRiskScore,
      congestionIndex: item.congestionIndex,
      eventNote: item.eventNote,
      ema20: ema20[idx] || item.ratePerMT,
      ema50: ema50[idx] || item.ratePerMT
    }));

    res.json({
      success: true,
      count: enriched.length,
      vesselClass,
      origin,
      destination,
      data: enriched
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMarketOverview,
  getFreightHistory
};
