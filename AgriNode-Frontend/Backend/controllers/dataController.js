const { readJSON, writeJSON } = require('../utils/fileHelper');
const path = require('path');
const fs = require('fs');

exports.getCollection = (req, res) => {
  const collection = req.params.collection;
  // Ensure only valid JSON files in data directory are accessed
  const validCollections = ['users', 'schemes', 'loans', 'loanApprovals', 'complaints', 'marketplace', 'communications', 'buyers', 'weather', 'payments', 'news', 'crops'];
  
  if (!validCollections.includes(collection)) {
    return res.status(400).json({ success: false, message: 'Invalid collection' });
  }

  try {
    const data = readJSON(collection);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCollection = (req, res) => {
  const collection = req.params.collection;
  const validCollections = ['users', 'schemes', 'loans', 'loanApprovals', 'complaints', 'marketplace', 'communications', 'buyers', 'weather', 'payments', 'news', 'crops'];
  
  if (!validCollections.includes(collection)) {
    return res.status(400).json({ success: false, message: 'Invalid collection' });
  }

  try {
    writeJSON(collection, req.body);
    res.json({ success: true, message: `Collection ${collection} updated.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
