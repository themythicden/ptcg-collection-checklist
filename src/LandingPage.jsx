import { useNavigate } from 'react-router-dom';
import { MASTER_COUNTS } from './constants';
import { useEffect, useState } from 'react';
import useSetLogos from './hooks/useSetLogos';
import SearchBar from './components/SearchBar';

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

const BASE_COUNTS = {
  DestinedRivals: 182,
  JourneyTogether: 159,
  PrismaticEvolutions: 131,
  SurgingSparks: 191,
  StellarCrown: 142,
  ShroudedFable: 64,
  TwilightMasquerade: 167,
  TemporalForces: 162,
  PaldeanFates: 91,
  ParadoxRift: 182,
  151: 165,
  ObsidianFlames: 197,
  PaldeaEvolved: 193,
  'Scarlet&Violet': 198,
  SilverTempest: 195
};

const MASTER_COUNTS = {
  DestinedRivals: 244,
  JourneyTogether: 190,
  PrismaticEvolutions: 180,
  SurgingSparks: 252,
  StellarCrown: 175,
  ShroudedFable: 99,
  TwilightMasquerade: 226,
  TemporalForces: 218,
  PaldeanFates: 245,
  ParadoxRift: 266,
  "151": 207,
  ObsidianFlames: 230,
  PaldeaEvolved: 279,
  "Scarlet&Violet": 258,
  SilverTempest: 215
};

const formatSetName = (name) =>
  name.replace(/([A-Z])/g, ' $1').replace(/&/g, ' & ').trim();

export default function LandingPage() {
  const navigate = useNavigate();
  const { logos, loading: loadingLogos } = useSetLogos();

  const [search, setSearch] = useState('');
  const [progress, setProgress] = useState({});
  const [matchingCards, setMatchingCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(false);
  const [mode, setMode] = useState('base');

  useEffect(() => {
    const fetchData = async () => {
      setLoadingCards(true);
      const progressObj = {};
      const matched = [];

      await Promise.all(
        Object.values(SET_NAME_MAP).map(async (setName) => {
          try {
            const res = await fetch(`/.netlify/functions/fetch-checklist?set=${setName}`);
            const data = await res.json();

            const realCards = data.filter(c => !c.name?.startsWith('__progress_'));
            const baseCount = BASE_COUNTS[setName] || 0;

            if (mode === 'base') {
              const baseCards = realCards.filter(card => parseInt(card.number) <= baseCount);
              const count = baseCards.reduce(
                (sum, card) =>
                  sum +
                  (card.standard === true ? 1 : 0) +
                  (card.holoFoil === true ? 1 : 0),
                0
              );
              progressObj[setName] = count;
            } else {
              const row = data.find(card => card.name === '__progress_master__');
              const total =
                (parseInt(row?.standard) || 0) +
                (parseInt(row?.reverseHolo) || 0) +
                (parseInt(row?.holoFoil) || 0) +
                (parseInt(row?.pokeball) || 0) +
                (parseInt(row?.masterball) || 0);
              progressObj[setName] = total;
            }

            if (search.trim()) {
              const setCode = Object.keys(SET_NAME_MAP).find(code => SET_NAME_MAP[code] === setName);
              realCards
                .filter(card =>
                  card.name?.toLowerCase().includes(search.toLowerCase())
                )
                .forEach(card => {
                  matched.push({ ...card, setName, setCode });
                });
            }
          } catch (err) {
            console.error(`Error loading ${setName}:`, err);
            progressObj[setName] = 0;
          }
        })
      );

      setProgress(progressObj);
      setMatchingCards(matched);
      setLoadingCards(false);
    };

    fetchData();
  }, [search, mode]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Pokémon Card Collection</h1>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <SearchBar
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search all cards..."
        />
        <div className="flex items-center gap-2">
          <label><input type="radio" name="mode" value="base" checked={mode === 'base'} onChange={() => setMode('base')} /> Base</label>
          <label><input type="radio" name="mode" value="master" checked={mode === 'master'} onChange={() => setMode('master')} /> Master</label>
        </div>
      </div>

      {(loadingLogos || loadingCards) ? (
        <p className="text-center mt-4">Loading...</p>
      ) : search.trim() ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
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
              <div className="font-semibold mb-1">{formatSetName(displayName)}</div>
              <img
                src={`https://images.pokemontcg.io/${setId}/symbol.png`}
                className="mx-auto h-6 w-auto object-contain mb-2"
              />
              <p className="text-sm text-gray-700 font-medium">
                {progress[displayName] || 0} / {mode === 'base' ? BASE_COUNTS[displayName] : MASTER_COUNTS[displayName]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
