import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  BASE_COUNTS,
  MASTER_COUNTS,
  SET_CODES
} from '../../shared/constants';
import SearchBar from '../components/SearchBar';
import Card from '../components/Card';

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
    const fetchCards = async (selectedSet) => {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/fetch-checklist?set=${selectedSet}`);
        const data = await res.json();

        const specialRows = data.filter(card => card.name?.startsWith('__progress_'));
        const realCards = data.filter(card =>
          card.name && !card.name.startsWith('__progress_') && !isNaN(parseInt(card.number))
        );

        // ✅ Inject setCode and setName into card
        const setCode = SET_CODES[selectedSet];
        realCards.forEach(card => {
          card.setCode = setCode;
          card.setName = selectedSet;
        });

        const progressData = {};
        specialRows.forEach(row => {
          const key = row.name.replace(/__progress_|__/g, '');
          progressData[key] = row;
        });

        setProgress(progressData);
        setCards(realCards);
      } catch (err) {
        console.error('Error fetching cards:', err);
      }
      setLoading(false);
    };

    fetchCards(setName);
  }, [setName]);

  const isCollected = (card) => {
    const rarity = card.rarity?.toLowerCase() || '';
    const type = card.type?.toLowerCase() || '';
    const number = parseInt(card.number);
    const baseLimit = BASE_COUNTS[setName];
    const isTrainer = type.includes('trainer');
    const isAceSpec = rarity.includes('ace spec');
    const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
    const isRare = rarity === 'rare';
    const isRareSecret = rarity === 'rare secret';
    const isPrismatic = setName === 'PrismaticEvolutions';
    const isSteamSiege = setName === 'SteamSiege';
    const isEvolutions = setName === 'Evolutions';

    if (mode === 'base') {
      if (isPrismatic) {
        if (isCommonOrUncommon || isTrainer) return card.standard;
        return card.holoFoil;
      }
      if(isSteamSiege || isEvolutions){
        if (rarity === 'rare holo') {
          return card.holoFoil && card.reverseHolo;
        }
        if (rarity === 'rare') {
          return card.standard && card.reverseHolo;
        }
        if (['rare break', 'rare holo ex', 'rare ultra'].includes(rarity)) {
          return card.holoFoil;
        }
      }
      if (isAceSpec) return card.holoFoil;
      if (isCommonOrUncommon || isTrainer) return card.standard;
      else if (isRare) return card.holoFoil;
      return card.holoFoil;
    }

    if (mode === 'parallel') {
      if (isPrismatic) {
        if (isCommonOrUncommon || isTrainer) {
          return card.standard && card.reverseHolo && card.pokeball;
        }
        if (isRare) {
          return card.reverseHolo && card.holoFoil && card.pokeball;
        }
        return card.holoFoil;
      }
      if(isSteamSiege || isEvolutions){
        if (isCommonOrUncommon) {
          return card.standard && card.reverseHolo;
        }
        if (rarity === 'rare') {
          return card.standard && card.reverseHolo;
        }
        if (rarity === 'rare holo') {
          return card.holoFoil && card.reverseHolo;
        }
        if (['rare break', 'rare holo ex', 'rare ultra'].includes(rarity)) {
          return card.holoFoil;
        }
        if (isRareSecret) {
          return card.standard;
        }
      }
      if (isAceSpec) return card.holoFoil;
      if (isCommonOrUncommon || isTrainer) return card.standard && card.reverseHolo;
      if (isRare) return card.reverseHolo && card.holoFoil;
      return card.holoFoil;
    }

    if (mode === 'master') {
      if (isAceSpec) return card.holoFoil;

      if (isPrismatic) {
        if (isCommonOrUncommon) {
          return card.standard && card.reverseHolo && card.pokeball && card.masterball;
        }
        if (isRare) {
          return card.holoFoil && card.reverseHolo && card.pokeball && card.masterball;
        }
        if (isTrainer && number <= baseLimit) {
          return card.standard && card.reverseHolo && card.pokeball;
        }
        return card.holoFoil;
      }
      
      if(isSteamSiege || isEvolutions){
        if (isCommonOrUncommon) {
          return card.standard && card.reverseHolo;
        }
        if (rarity === 'rare') {
          return card.standard && card.reverseHolo;
        }
        if (rarity === 'rare holo') {
          return card.holoFoil && card.reverseHolo;
        }
        if (['rare break', 'rare holo ex', 'rare ultra'].includes(rarity)) {
          return card.holoFoil;
        }
        if (isRareSecret) {
          return card.standard;
        }
      }

      if ((isCommonOrUncommon || isTrainer) && number <= baseLimit) {
        return card.standard && card.reverseHolo;
      }
      if (isRare) {
        return card.holoFoil && card.reverseHolo;
      }
      if (isTrainer && number <= baseLimit) {
        return card.standard && card.reverseHolo;
      }
      return card.holoFoil;
    }

    return false;
  };

  const filteredCards = cards.filter(card => {
    const collected = isCollected(card);
    if (hideCompleted && collected) return false;
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
  const set = setName;
  const payload = { name, [key]: value, set };

  // Defensive check
  if (!name || !key || typeof value === 'undefined' || !set) {
    console.error('❌ Invalid data being sent to save-checklist:', payload);
    return;
  }
  
      try {
        console.log('✅ Sending to save-checklist:', payload);
    
        const response = await fetch('/.netlify/functions/save-checklist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
    
        const result = await response.text();
        console.log('✅ Save response:', result);
      } catch (err) {
        console.error('❌ Save error:', err);
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
          <button onClick={() => navigate('/')} className="text-blue-600 underline">← Back to Sets</button>

          <div>
            <label className="mr-2">Mode:</label>
            {['base', 'parallel', 'master'].map(opt => (
              <label key={opt} className="mr-2">
                <input
                  type="radio"
                  name="mode"
                  value={opt}
                  checked={mode === opt}
                  onChange={e => setMode(e.target.value)}
                /> {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </label>
            ))}
          </div>

          <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards..." />
          <label>
            <input type="checkbox" checked={hideCompleted} onChange={() => setHideCompleted(!hideCompleted)} /> Hide Completed
          </label>
          <span className="ml-auto text-blue-600 font-medium">{collectedCount} / {totalCount}</span>

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
