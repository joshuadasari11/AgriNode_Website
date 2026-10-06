const { readJSON, writeJSON } = require('../utils/fileHelper');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/weather.json');

exports.getWeather = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    // Mock live data if empty
    if (data.length === 0) {
      return res.json({
        success: true,
        data: {
          temp: 28,
          condition: "Partly Cloudy",
          humidity: "65%",
          wind: "12 km/h",
          forecast: [
            { day: "Mon", temp: 29, condition: "Sunny" },
            { day: "Tue", temp: 31, condition: "Sunny" },
            { day: "Wed", temp: 27, condition: "Rain" }
          ]
        }
      });
    }
    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
