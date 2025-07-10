// netlify/functions/fetch-checklist.js
const { SHEET_NAMES } = require('../shared/constants'); // Adjust path as needed
const fetch = require('node-fetch'); // Ensure node-fetch is available

exports.handler = async function (event) {
  const querySet = event.queryStringParameters.set;
  const sheetName = SHEET_NAMES[querySet] || 'JourneyTogether';

  const url = `https://script.google.com/macros/s/AKfycbzGyOrVGm3WRC34j34QKA2cjJA1upq9drnnOtXhRXedyT5SqFTjMMm-OgUNecfJd5YhRA/exec?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();
console.log('Querying sheet:', sheetName);
console.log('Raw response JSON:', json);

    f (!Array.isArray(json)) {
  console.error("Invalid sheet data:", json); // Add this
  throw new Error("Invalid sheet data returned");
}

    return {
      statusCode: 200,
      body: JSON.stringify(json)
    };
  } catch (error) {
    console.error('Fetch failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data', details: error.message })
    };
  }
};
