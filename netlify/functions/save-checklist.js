exports.handler = async function (event) {
  try {
    const data = JSON.parse(event.body);
    const sheet = data.set || 'JourneyTogether';

    const url = `https://script.google.com/macros/s/AKfycbzGyOrVGm3WRC34j34QKA2cjJA1upq9drnnOtXhRXedyT5SqFTjMMm-OgUNecfJd5YhRA/exec?sheet=${encodeURIComponent(sheet)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.text();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: result })
    };
  } catch (error) {
    console.error('Save checklist error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to save checklist',
        details: error.message
      })
    };
  }
};
