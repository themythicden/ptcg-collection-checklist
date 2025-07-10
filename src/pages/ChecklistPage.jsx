import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card';

import {
  BASE_COUNTS,
  MASTER_COUNTS,
  SET_CODES,
  SET_NAME_MAP,
  SHEET_NAMES,
  DISPLAY_NAMES,
  formatSetName
} from '../../shared/constants';

export default function ChecklistPage() {
  const { setName } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('base'); // base | master
  const [hideCollected, setHideCollected] = useState(false);
  const [filterRarity, setFilterRarity] = useState('');

  const baseCount = BASE_COUNTS[setName];
  const masterCount = MASTER_COUNTS[setName];
  const setCode = SET_CODES[setName];

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/fetch-checklist?set=${setName}`);
        const data = await res.json();
        setCards(data.filter(card => !card.name?.startsWith('__progress_')));
      } catch (err) {
        console.error('Failed to load cards:', err);
        setCards([]);
      }
      setLoading(false);
    };
    fetchCards();
  }, [setName]);

  const filtered = cards.filter(card => {
    const number = parseInt(card.number);
    const isBase = number <= baseCount;
    const isMaster = number <= masterCount;

    const includeByView =
      view === 'base' ? isBase :
      view === 'master' ? isMaster :
      true;

    const collected = ['standard', 'reverseHolo', 'holoFoil', 'pokeball', 'masterball']
      .some(type => card[type]);

    const matchesRarity = filterRarity ? card.rarity === filterRarity : true;

    return includeByView && (!hideCollected || !collected) && matchesRarity;
  });

  const collectedCount = cards.reduce((sum, card) => {
    const number = parseInt(card.number);
    const withinRange = view === 'base' ? number <= baseCount : number <= masterCount;
    if (!withinRange) return sum;
    return sum + ['standard', 'reverseHolo', 'holoFoil', 'pokeball', 'masterball']
      .reduce((s, type) => s + (card[type] ? 1 : 0), 0);
  }, 0);

  const total = view === 'base' ? baseCount : masterCount;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-4">
        {formatSetName(setName)} Checklist
      </h1>

      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <div className="flex gap-2">
          <label>
            <input
              type="radio"
              name="view"
              value="base"
              checked={view === 'base'}
              onChange={() => setView('base')}
            /> Base Set
          </label>
          <label>
            <input
              type="radio"
              name="view"
              value="master"
              checked={view === 'master'}
              onChange={() => setView('master')}
            /> Master Set
          </label>
        </div>

        <div className="text-sm font-semibold">
          Progress: {collectedCount} / {total}
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={hideCollected}
              onChange={e => setHideCollected(e.target.checked)}
            /> Hide Collected
          </label>
        </div>

        <div>
          <select
            value={filterRarity}
            onChange={e => setFilterRarity(e.target.value)}
            className="border rounded p-1"
          >
            <option value="">All Rarities</option>
            {[...new Set(cards.map(c => c.rarity).filter(Boolean))].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-center mt-10">Loading cards...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {filtered.map(card => (
            <Card key={card.name + card.number} card={card} setCode={setCode} setName={setName} />
          ))}
        </div>
      )}
    </div>
  );
}
