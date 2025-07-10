// netlify/functions/fetch-checklist.js
const { SHEET_NAMES } = require('../shared/constants');
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const querySet = event.queryStringParameters.set;
  const sheetName = SHEET_NAMES[querySet] || 'JourneyTogether';

  const url = `https://script.google.com/macros/s/AKfycbzGyOrVGm3WRC34j34QKA2cjJA1upq9drnnOtXhRXedyT5SqFTjMMm-OgUNecfJd5YhRA/exec?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    try {
      const json = JSON.parse(text);

      if (!Array.isArray(json)) {
        throw new Error("Parsed JSON is not an array");
      }

      return {
        statusCode: 200,
        body: JSON.stringify(json),
      };
    } catch (parseError) {
      console.error("Failed to parse JSON:", text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Invalid JSON response', details: parseError.message })
      };
    }
  } catch (error) {
    console.error('Fetch failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data', details: error.message })
    };
  }
};
