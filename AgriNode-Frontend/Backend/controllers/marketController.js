const { readJSON, writeJSON } = require('../utils/fileHelper');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/market-prices.json');

exports.getMarketPrices = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
