import { SHEET_NAMES } from '../shared/constants.js'; // ✅ Make sure constants file also uses ESM exports
import fetch from 'node-fetch'; // ✅ ESM import

export async function handler(event) {
  const set = event.queryStringParameters.set;

  if (!set || !SHEET_NAMES[set]) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Invalid set key: ${set}` }),
    };
  }

  const sheetName = SHEET_NAMES[set];
  const url = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?sheet=${encodeURIComponent(sheetName)}`;

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
}
