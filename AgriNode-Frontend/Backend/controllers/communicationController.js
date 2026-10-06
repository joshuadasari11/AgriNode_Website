const { readJSON, writeJSON } = require('../utils/fileHelper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/communications.json');

exports.getMessages = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    // Logic to filter by user/role can be added here
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    const newMessage = {
      id: uuidv4(),
      ...req.body, // { senderId, receiverId, message, role }
      timestamp: new Date().toISOString()
    };
    data.push(newMessage);
    await writeJSON(DATA_FILE, data);
    res.json({ success: true, message: 'Message sent.', data: newMessage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
