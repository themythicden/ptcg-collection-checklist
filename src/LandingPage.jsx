import { useNavigate } from 'react-router-dom';
import { MASTER_COUNTS } from './constants';
import { useEffect, useState } from 'react';
import useSetLogos from './hooks/useSetLogos';
import SearchBar from './components/SearchBar';
//import PrintableListWrapper from '../components/PrintableListWrapper';



//If it fetches the wrong cards and name
const SET_NAME_MAP = {
  sv10: 'DestinedRivals',
  sv9: 'JourneyTogether',
  sv8pt5: 'PrismaticEvolutions',
  sv8: 'SurgingSparks',
  sv7: 'StellarCrown',
  sv6pt5: 'ShroudedFable',
  sv6: 'TwilightMasquerade',
  sv5: 'TemporalForces',
  sv4pt5: 'PaldeanFates',
  sv4: 'ParadoxRift',
  sv3pt5: '151',
  sv3: 'ObsidianFlames',
  sv2: 'PaldeaEvolved',
  sv1: 'Scarlet&Violet',
  swsh12: 'SilverTempest'
};

// Utility to format set name for display
const formatSetName = (name) =>
  name.replace(/([A-Z])/g, ' $1').replace(/&/g, ' & ').trim();

export default function LandingPage() {
  const navigate = useNavigate();
  const { logos, loading: loadingLogos } = useSetLogos();

  const [search, setSearch] = useState('');
  const [progress, setProgress] = useState({});
  const [matchingCards, setMatchingCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoadingCards(true);
      const progressObj = {};
      const matches = [];

      await Promise.all(
        Object.values(SET_NAME_MAP).map(async (setName) => {
          try {
            const res = await fetch(`/.netlify/functions/fetch-checklist?set=${setName}`);
            const data = await res.json();

            // Progress row
            const progressRow = data.find(card => card.name === '__progress_master__');
            if (progressRow) {
              const total =
                (parseInt(progressRow.standard) || 0) +
                (parseInt(progressRow.reverseHolo) || 0) +
                (parseInt(progressRow.holoFoil) || 0) +
                (parseInt(progressRow.pokeball) || 0) +
                (parseInt(progressRow.masterball) || 0);
              progressObj[setName] = total;
            } else {
              progressObj[setName] = 0;
            }

            // Match cards (if searching)
            if (search.trim()) {
              const setCode = Object.keys(SET_NAME_MAP).find(code => SET_NAME_MAP[code] === setName);

              data
                .filter(card =>
                  card.name?.toLowerCase().includes(search.toLowerCase()) &&
                  !card.name.startsWith('__progress_')
                )
                .forEach(card => {
                  matches.push({ ...card, setName, setCode });
                });
            }
          } catch (err) {
            console.error(`Error loading ${setName}:`, err);
            progressObj[setName] = 0;
          }
        })
      );

      setProgress(progressObj);
      setMatchingCards(matches);
      setLoadingCards(false);
    };

    fetchAllData();
  }, [search]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Pokémon Master Set Checklist</h1>

      <SearchBar
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search all cards..."
      />

      {(loadingLogos || loadingCards) ? (
        <p className="text-center mt-4">Loading...</p>
      ) : search.trim() ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {matchingCards.length === 0 ? (
            <p className="col-span-full text-center">No cards found.</p>
          ) : (
            matchingCards.map((card, index) => (
              <div
                key={card.name + card.number + index}
                className="border rounded-lg p-4 bg-white shadow hover:shadow-md cursor-pointer"
                onClick={() => navigate(`/set/${card.setName}`)}
              >
                <img
                  src={`https://images.pokemontcg.io/${card.setCode}/${card.number}.png`}
                  alt={card.name}
                  className="w-24 h-auto mb-2"
                />
                <h2 className="font-bold text-lg">{card.name}</h2>
                <p className="text-sm text-gray-600">
                  #{card.number} • {card.rarity || 'N/A'}
                </p>
                <p className="text-sm text-blue-700">
                  Set: {formatSetName(card.setName)}
                </p>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {Object.entries(SET_NAME_MAP).map(([setId, displayName]) => (
            <div
              key={setId}
              className="border rounded-xl p-4 hover:shadow cursor-pointer text-center bg-white transition duration-200 hover:scale-105"
              onClick={() => navigate(`/set/${displayName}`)}
            >
              <img
                src={logos[setId] || '/fallback-logo.png'}
                alt={displayName}
                className="mx-auto mb-2 h-12 w-auto object-contain"
              />
              <div className="font-semibold">{formatSetName(displayName)}</div>
              <img src={`https://images.pokemontcg.io/${setId}/symbol.png`} className="mx-auto"/>
              <p className="text-sm text-gray-600">
                {progress[displayName] || 0} / {MASTER_COUNTS[displayName]} cards
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
