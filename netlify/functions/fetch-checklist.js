const SHEET_NAMES = {
    ObsidianFlames: 'ObsidianFlames', 
    TemporalForces: 'TemporalForces',
    PrismaticEvolutions: 'PrismaticEvolutions',
    JourneyTogether: 'JourneyTogether',
    DestinedRivals: 'DestinedRivals',
    PaldeaEvolved: 'PaldeaEvolved',
    ParadoxRift: 'ParadoxRift'
  };
  
  exports.handler = async function (event) {
    const sheetName = SHEET_NAMES[event.queryStringParameters.set] || 'JourneyTogether';
  
    const url = `https://script.google.com/macros/s/AKfycbzGyOrVGm3WRC34j34QKA2cjJA1upq9drnnOtXhRXedyT5SqFTjMMm-OgUNecfJd5YhRA/exec?sheet=${encodeURIComponent(sheetName)}`;
  
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
