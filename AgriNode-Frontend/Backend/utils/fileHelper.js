// ─────────────────────────────────────────────────────────────────────────────
// utils/fileHelper.js
//
// Thin abstraction over JSON file I/O – the single place to swap for MySQL.
//
// Future MySQL migration:
//   Replace readData / writeData with a db.js module that exports a
//   mysql2/promise pool. All controllers call the same function names,
//   so only this file and the controller query strings need to change.
// ─────────────────────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * readData(filename)
 * Reads a JSON data file and returns its parsed contents.
 * @param {string} filename  – file name without .json extension
 * @returns {object}         – parsed JSON object
 */
const readData = (filename) => {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[fileHelper] Failed to read ${filename}.json:`, err.message);
    return {};
  }
};

/**
 * writeData(filename, data)
 * Writes a JSON object back to its data file (pretty-printed).
 * @param {string} filename  – file name without .json extension
 * @param {object} data      – object to serialize
 */
const writeData = (filename, data) => {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`[fileHelper] Failed to write ${filename}.json:`, err.message);
    throw new Error('Storage write failed');
  }
};

module.exports = { readJSON: readData, writeJSON: writeData };
