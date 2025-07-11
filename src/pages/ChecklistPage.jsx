import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Card from '../components/Card';
import {
  SET_CODES,
  BASE_COUNTS,
  MASTER_COUNTS,
  formatSetName
} from '../../shared/constants';

export default function ChecklistPage() {
  const { setName } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [setType, setSetType] = useState('base'); // base, parallel, master
  const [hideCollected, setHideCollected] = useState(false);

  const baseCount = BASE_COUNTS[setName] || 0;
  const masterCount = MASTER_COUNTS[setName] || 0;
  const setCode = SET_CODES[setName];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/fetch-checklist?set=${setName}`);
        const data = await res.json();
        setCards(data.filter(card => !card.name?.startsWith('__progress_')));
      } catch (err) {
        console.error(`Failed to fetch data for ${setName}`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setName]);

  const isCollected = (card) => {
    if (setType === 'base') return card.standard === '✓';
    if (setType === 'parallel') return card.reverseHolo === '✓';
    return (
      card.standard === '✓' ||
      card.reverseHolo === '✓' ||
      card.holoFoil === '✓' ||
      card.pokeball === '✓' ||
      card.masterball === '✓'
    );
  };

  const filteredCards = cards.filter(card => {
    const cardNumber = parseInt(card.number);
    const includeInMaster = setType === 'master';
    const includeInParallel = setType === 'parallel' && cardNumber <= baseCount;
    const includeInBase = setType === 'base' && cardNumber <= baseCount;

    const shouldInclude =
      includeInMaster || includeInParallel || includeInBase;

    return shouldInclude && (!hideCollected || !isCollected(card));
  });

  const collectedCount = cards.reduce((total, card) => {
    const cardNumber = parseInt(card.number);
    if (setType === 'base' && cardNumber <= baseCount && card.standard === '✓') return total + 1;
    if (setType === 'parallel' && cardNumber <= baseCount && card.reverseHolo === '✓') return total + 1;
    if (setType === 'master') {
      return (
        total +
        ['standard', 'reverseHolo', 'holoFoil', 'pokeball', 'masterball'].reduce(
          (sum, key) => sum + (card[key] === '✓' ? 1 : 0),
          0
        )
      );
    }
    return total;
  }, 0);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-2 text-center">
        {formatSetName(setName)} - {setType.charAt(0).toUpperCase() + setType.slice(1)} Set
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {['base', 'parallel', 'master'].map(type => (
          <button
            key={type}
            onClick={() => setSetType(type)}
            className={`px-3 py-1 border rounded ${
              setType === type ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} Set
          </button>
        ))}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hideCollected}
            onChange={() => setHideCollected(!hideCollected)}
          />
          Hide Collected
        </label>
      </div>

      <p className="text-center text-gray-600 mb-4">
        {collectedCount} / {setType === 'base'
          ? baseCount
          : setType === 'parallel'
          ? baseCount
          : masterCount} collected
      </p>

      {loading ? (
        <p className="text-center">Loading cards...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <Card
              key={card.name + card.number}
              card={{ ...card, setCode, setName }}
              setName={setName}
              setCode={setCode}
              setType={setType}
            />
          ))}
        </div>
      )}
    </div>
  );
}
