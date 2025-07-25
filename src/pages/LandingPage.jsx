import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useSetLogos from '../hooks/useSetLogos';
import SearchBar from '../components/SearchBar';

import {
  BASE_COUNTS,
  MASTER_COUNTS,
  SET_CODES,
  SET_NAME_MAP,
  formatSetName
} from '../../shared/constants';

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

            if (search.trim()) {
              const setCode = SET_CODES[setName];
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
                  src={card.setCode ? `https://images.pokemontcg.io/${card.setCode}/${card.number}.png` : '/fallback-card.png'}
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
          {Object.entries(SET_NAME_MAP).map(([setCode, setName]) => (
            <div
              key={setCode}
              className="border rounded-xl p-4 hover:shadow cursor-pointer text-center bg-white transition duration-200 hover:scale-105"
              onClick={() => navigate(`/set/${setName}`)}
            >
              <img
                src={logos[setCode] || '/fallback-logo.png'}
                alt={setName}
                className="mx-auto mb-2 h-12 w-auto object-contain"
              />
              <div className="font-semibold">{formatSetName(setName)}</div>
              <img src={`https://images.pokemontcg.io/${setCode}/symbol.png`} className="mx-auto w-10" />
              <p className="text-sm text-gray-600">
                {progress[setName] || 0} / {MASTER_COUNTS[setName]} cards
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
