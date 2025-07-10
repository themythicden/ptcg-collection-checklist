// ChecklistPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from './components/Card';
import SearchBar from './components/SearchBar';
import {
  BASE_COUNTS,
  MASTER_COUNTS,
  SET_CODES,
  formatSetName
} from './constants';
import './index.css';

export default function ChecklistPage() {
  const { setName: routeSetName } = useParams();
  const [setName, setSetName] = useState(routeSetName || 'JourneyTogether');
  const [cards, setCards] = useState([]);
  const [progress, setProgress] = useState({});
  const [mode, setMode] = useState('base');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCards(setName);
  }, [setName]);

  const fetchCards = async (selectedSet) => {
    setLoading(true);
    try {
      const res = await fetch(`/.netlify/functions/fetch-checklist?set=${selectedSet}`);
      const data = await res.json();

      const progressRows = data.filter(card => card.name?.startsWith('__progress_'));
      const realCards = data.filter(
        card => card.name && !card.name.startsWith('__progress_') && !isNaN(parseInt(card.number))
      );

      realCards.forEach(card => {
        card.setCode = SET_CODES[selectedSet];
        card.setName = selectedSet;
      });

      const progressMap = {};
      progressRows.forEach(row => {
        const key = row.name.replace(/__progress_|__/g, '');
        progressMap[key] = row;
      });

      setCards(realCards);
      setProgress(progressMap);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
    setLoading(false);
  };

  const isCollected = (card) => {
    const rarity = card.rarity?.toLowerCase() || '';
    const type = card.type?.toLowerCase() || '';
    const number = parseInt(card.number);
    const baseLimit = BASE_COUNTS[setName];
    const isTrainer = type.includes('trainer');
    const isAceSpec = rarity.includes('ace spec');
    const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
    const isRare = rarity === 'rare';
    const isPrismatic = setName === 'PrismaticEvolutions';

    if (mode === 'base') {
      if (isPrismatic) {
        if (isCommonOrUncommon || isTrainer) return card.standard;
        return card.holoFoil;
      }
      if (isAceSpec) return card.holoFoil;
      if (isCommonOrUncommon || isTrainer) return card.standard;
      if (isRare) return card.holoFoil;
      return card.holoFoil;
    }

    if (mode === 'parallel') {
      if (isPrismatic) {
        if (isCommonOrUncommon || isTrainer)
          return card.standard && card.reverseHolo && card.pokeball;
        if (isRare)
          return card.reverseHolo && card.holoFoil && card.pokeball;
        return card.holoFoil;
      }
      if (isAceSpec) return card.holoFoil;
      if (isCommonOrUncommon || isTrainer)
        return card.standard && card.reverseHolo;
      if (isRare) return card.reverseHolo && card.holoFoil;
      return card.holoFoil;
    }

    if (mode === 'master') {
      if (isAceSpec) return card.holoFoil;

      if (isPrismatic) {
        if (isCommonOrUncommon)
          return card.standard && card.reverseHolo && card.pokeball && card.masterball;
        if (isRare)
          return card.holoFoil && card.reverseHolo && card.pokeball && card.masterball;
        if (isTrainer && number <= baseLimit)
          return card.standard && card.reverseHolo && card.pokeball;
        return card.holoFoil;
      }

      if ((isCommonOrUncommon || isTrainer) && number <= baseLimit)
        return card.standard && card.reverseHolo && card.pokeball && card.masterball;
      if (isRare)
        return card.holoFoil && card.reverseHolo && card.pokeball && card.masterball;
      if (isTrainer && number <= baseLimit)
        return card.standard && card.reverseHolo && card.pokeball;

      return card.holoFoil;
    }

    return false;
  };

  const filteredCards = cards.filter(card => {
    if (hideCompleted && isCollected(card)) return false;
    if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
    if ((mode === 'base' || mode === 'parallel') && parseInt(card.number) > BASE_COUNTS[setName]) return false;
    return true;
  });

  const onCheckboxChange = (card, key) => {
    const updatedValue = !card[key];
    handleCheckboxChange(card.name, key, updatedValue);
    setCards(prev =>
      prev.map(c => c.name === card.name ? { ...c, [key]: updatedValue } : c)
    );
  };

  const handleCheckboxChange = async (name, key, value) => {
    try {
      await fetch('/.netlify/functions/save-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, [key]: value, set: setName })
      });
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const getTotalFromProgress = () => {
    const row = progress[mode];
    if (!row) return 0;
    return (
      (parseInt(row.standard) || 0) +
      (parseInt(row.reverseHolo) || 0) +
      (parseInt(row.holoFoil) || 0) +
      (parseInt(row.pokeball) || 0) +
      (parseInt(row.masterball) || 0)
    );
  };

  const collectedCount = getTotalFromProgress();

  const getParallelTotal = () => {
    const baseCards = cards.filter(card => parseInt(card.number) <= BASE_COUNTS[setName]);
    const doubleRares = baseCards.filter(card => card.rarity?.toLowerCase() === 'double rare').length;
    return (BASE_COUNTS[setName] * 2) - doubleRares;
  };

  const totalCount =
    mode === 'base'
      ? BASE_COUNTS[setName]
      : mode === 'parallel'
      ? getParallelTotal()
      : MASTER_COUNTS[setName];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="sticky top-0 bg-white z-10 shadow p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
          <button onClick={() => navigate('/')} className="text-blue-600 underline">
            ← Back to Sets
          </button>

          <div>
            <label className="mr-2">Mode:</label>
            {['base', 'parallel', 'master'].map(m => (
              <label key={m} className="mr-2">
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={e => setMode(e.target.value)}
                />{' '}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </label>
            ))}
          </div>

          <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards..." />
          <label>
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={() => setHideCompleted(!hideCompleted)}
            />{' '}
            Hide Completed
          </label>
          <span className="ml-auto text-blue-600 font-medium">
            {collectedCount} / {totalCount}
          </span>
          <button
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
            onClick={() => window.open(`/print/${setName}`, '_blank')}
          >
            🖨️ Print Missing
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCards.map(card => (
            <Card key={card.name + card.number} card={card} mode={mode} onCheckboxChange={onCheckboxChange} />
          ))}
        </div>
      )}
    </div>
  );
}
