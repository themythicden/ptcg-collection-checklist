import fetch from 'node-fetch';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: 'OK',
    };
  }

  try {
    const data = JSON.parse(event.body);
    const sheet = data.set || 'JourneyTogether';
    const url = `https://script.google.com/macros/s/AKfycbxrYN4UG2uvTsgp2955QUioF4lfRudXUij8DdSN6KgSSXoPxjpRmCrdgg1m3ergiuHp/exec?sheet=${encodeURIComponent(sheet)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: result }),
    };
  } catch (error) {
    console.error('Save checklist error:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to save checklist', details: error.message }),
    };
  }
}