const { SHEET_NAMES } = require('../shared/constants'); // Update the path if needed
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const querySet = event.queryStringParameters.set;
  const sheetName = SHEET_NAMES[querySet] || 'JourneyTogether';

  const url = `https://script.google.com/macros/s/AKfycbxrYN4UG2uvTsgp2955QUioF4lfRudXUij8DdSN6KgSSXoPxjpRmCrdgg1m3ergiuHp/exec?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (parseErr) {
      throw new Error(`Invalid JSON: ${text.slice(0, 300)}`);
    }

    if (!Array.isArray(json)) {
      throw new Error('Expected an array of card objects, got: ' + JSON.stringify(json));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(json)
    };
  } catch (error) {
    console.error('Fetch failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch checklist data', details: error.message })
    };
  }
};
