const { readJSON, writeJSON } = require('../utils/fileHelper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/complaints.json');

exports.getComplaints = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.fileComplaint = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    const newComplaint = {
      id: uuidv4(),
      ...req.body,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    data.push(newComplaint);
    await writeJSON(DATA_FILE, data);
    res.json({ success: true, message: 'Complaint filed successfully.', data: newComplaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    const { id, status, resolution } = req.body;
    const index = data.findIndex(c => c.id === id);
    if (index > -1) {
      data[index].status = status;
      if (resolution) data[index].resolution = resolution;
      await writeJSON(DATA_FILE, data);
      res.json({ success: true, message: 'Complaint updated.' });
    } else {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
