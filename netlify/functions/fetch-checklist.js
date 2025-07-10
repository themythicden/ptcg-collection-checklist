// netlify/functions/fetch-checklist.js
const { SHEET_NAMES } = require('../shared/constants');
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const querySet = event.queryStringParameters.set;

  if (!querySet || !SHEET_NAMES[querySet]) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Invalid set: ${querySet}` }),
    };
  }

  const sheetName = SHEET_NAMES[querySet];

  const url = `https://script.google.com/macros/s/AKfycbxrYN4UG2uvTsgp2955QUioF4lfRudXUij8DdSN6KgSSXoPxjpRmCrdgg1m3ergiuHp/exec?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error('Invalid sheet data returned');
    }

    return {
      statusCode: 200,
      body: JSON.stringify(json)
    };
  } catch (error) {
    console.error('Fetch failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Fetch error', details: error.message })
    };
  }
};
