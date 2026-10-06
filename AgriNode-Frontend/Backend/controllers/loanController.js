const { readJSON, writeJSON } = require('../utils/fileHelper');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/loans.json');

exports.getLoans = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.applyLoan = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    const newLoan = {
      id: uuidv4(),
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    data.push(newLoan);
    await writeJSON(DATA_FILE, data);
    res.json({ success: true, message: 'Loan application submitted.', data: newLoan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLoanStatus = async (req, res) => {
  try {
    const data = await readJSON(DATA_FILE);
    const { id, status } = req.body;
    const loanIndex = data.findIndex(l => l.id === id);
    if (loanIndex > -1) {
      data[loanIndex].status = status;
      await writeJSON(DATA_FILE, data);
      res.json({ success: true, message: 'Loan status updated.' });
    } else {
      res.status(404).json({ success: false, message: 'Loan not found.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
