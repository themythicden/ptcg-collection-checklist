// netlify/functions/fetch-checklist.js
import { SHEET_NAMES } from '../../shared/constants.js'; // ✅ adjust relative path
import fetch from 'node-fetch'; // ✅ make sure this is installed in your project (Netlify supports this)

export const handler = async (event) => {
  const querySet = event.queryStringParameters?.set;
  const sheetName = SHEET_NAMES[querySet] || 'JourneyTogether';

  const url = `https://script.google.com/macros/s/AKfycbxrYN4UG2uvTsgp2955QUioF4lfRudXUij8DdSN6KgSSXoPxjpRmCrdgg1m3ergiuHp/exec?sheet=${encodeURIComponent(sheetName)}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (!Array.isArray(json)) {
      throw new Error("Invalid sheet data returned");
    }

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (error) {
    console.error('Fetch failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to fetch data',
        details: error.message,
      }),
    };
  }
};
