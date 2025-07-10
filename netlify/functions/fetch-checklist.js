const SHEET_NAMES = {
    JourneyTogether: 'JourneyTogether',
    TemporalForces: 'TemporalForces',
    ObsidianFlames: 'ObsidianFlames', 
    PrismaticEvolutions: 'PrismaticEvolutions'
  };
  
  exports.handler = async function (event) {
    const sheetName = SHEET_NAMES[event.queryStringParameters.set] || 'JourneyTogether';
  
    const url = `https://script.google.com/macros/s/AKfycbxrYN4UG2uvTsgp2955QUioF4lfRudXUij8DdSN6KgSSXoPxjpRmCrdgg1m3ergiuHp/exec?sheet=${encodeURIComponent(sheetName)}`;
  
    try {
      const response = await fetch(url);
      const json = await response.json();
  
      if (!Array.isArray(json)) {
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
