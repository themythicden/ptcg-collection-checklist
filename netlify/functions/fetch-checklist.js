const { SHEET_NAMES } = require('../src/constants');
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const querySet = event.queryStringParameters.set;
  const sheetName = SHEET_NAMES[querySet] || 'JourneyTogether';

  const url = `https://script.google.com/macros/s/AKfycbxrYN4UG2uvTsgp2955QUioF4lfRudXUij8DdSN6KgSSXoPxjpRmCrdgg1m3ergiuHp/exec?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();

    // Log raw response for debugging
    console.log(`Raw response for ${querySet}:`, text.slice(0, 300));

    let json;
    try {
      json = JSON.parse(text);
    } catch (err) {
      throw new Error(`Invalid JSON returned: ${text.slice(0, 200)}`);
    }

    if (!Array.isArray(json)) {
      throw new Error(`Expected array, but got: ${typeof json}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (err) {
    console.error('Function error:', err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch checklist', details: err.message }),
    };
  }
};
