import { useNavigate } from 'react-router-dom';
import { MASTER_COUNTS } from './constants';
import { useEffect, useState } from 'react';
import useSetLogos from './hooks/useSetLogos';

const SET_NAME_MAP = {
  sv9: 'JourneyTogether',
  sv5: 'TemporalForces',
  sv3: 'ObsidianFlames',
  sv8pt5: 'PrismaticEvolutions',
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { logos, loading } = useSetLogos();
  const [progress, setProgress] = useState({});
  const [search, setSearch] = useState('');
  const [matchingSets, setMatchingSets] = useState(Object.values(SET_NAME_MAP)); // Default: show all

  useEffect(() => {
    const getProgressAndSearch = async () => {
      const obj = {};
      const matched = [];

      for (let set of Object.values(SET_NAME_MAP)) {
        try {
          const res = await fetch(`/.netlify/functions/fetch-checklist?set=${set}`);
          const data = await res.json();

          // Progress count from __progress_master__ row
          const progressRow = data.find(card => card.name === '__progress_master__');
          if (progressRow) {
            const total =
              (parseInt(progressRow.standard) || 0) +
              (parseInt(progressRow.reverseHolo) || 0) +
              (parseInt(progressRow.holoFoil) || 0) +
              (parseInt(progressRow.pokeball) || 0) +
              (parseInt(progressRow.masterball) || 0);
            obj[set] = total;
          } else {
            obj[set] = 0;
          }

          // Search matching cards
          if (search) {
            const matchedCard = data.find(card =>
              card.name?.toLowerCase().includes(search.toLowerCase())
            );
            if (matchedCard) matched.push(set);
          } else {
            matched.push(set); // show all if no search
          }
        } catch (err) {
          console.error(`Failed to load data for ${set}:`, err);
          obj[set] = 0;
        }
      }

      setProgress(obj);
      setMatchingSets(matched);
    };

    getProgressAndSearch();
  }, [search]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Pokémon Master Set Checklist
      </h1>

      <div className="mb-6 text-center">
        <input
          type="text"
          placeholder="Search all cards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full max-w-md"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading sets...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Object.entries(SET_NAME_MAP)
            .filter(([_, displayName]) => matchingSets.includes(displayName))
            .map(([setId, displayName]) => (
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
                <div className="font-semibold">{displayName.replace(/([A-Z])/g, ' $1')}</div>
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
