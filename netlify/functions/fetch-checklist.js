const { SHEET_NAMES } = require('../shared/constants');
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const set = event.queryStringParameters.set;

  if (!set || !SHEET_NAMES[set]) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Invalid set key: ${set}` }),
    };
  }

  const sheetName = SHEET_NAMES[set];
  const url = `https://script.google.com/macros/s/PASTE-YOUR-URL/exec?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error('Invalid response from Google Sheet');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error', details: error.message }),
    };
  }
};
