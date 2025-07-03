import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from './components/Card';
import './index.css';
import SearchBar from './components/SearchBar';

const BASE_COUNTS = {
  DestinedRivals: 182,
  JourneyTogether: 159,
  PrismaticEvolutions: 131,
  SurgingSparks: 191,
  StellarCrown: 142,
  TwilightMasquerade: 167,
  TemporalForces: 162,
  ParadoxRift: 182,
  151: 165,
  ObsidianFlames: 197,
  PaldeaEvolved : 193,
  ScarletViolet: 198,
};

const MASTER_COUNTS = {
  DestinedRivals: 244,
  JourneyTogether: 190,
  PrismaticEvolutions: 180,
  SurgingSparks: 252,
  StellarCrown: 175,
  TwilightMasquerade: 226,
  TemporalForces: 218,
  ParadoxRift: 266,
  151: 207,
  ObsidianFlames: 230,
  PaldeaEvolved : 279,
  ScarletViolet: 258,
};

const getSetCode = (setName) => ({
  DestinedRivals: 'sv10',
  JourneyTogether: 'sv9',
  PrismaticEvolutions: 'sv8pt5',
  SurgingSparks: 'sv8',
  StellarCrown: 'sv7',
  TwilightMasquerade: 'sv6',
  TemporalForces: 'sv5',
  ParadoxRift: 'sv4',
  151: 'sv3pt5',
  ObsidianFlames: 'sv3',
  PaldeaEvolved:'sv2',
  ScarletViolet: 'sv1'
}[setName] || 'sv9');

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
const [search, setSearch] = useState('');


  const fetchCards = async (selectedSet) => {
    setLoading(true);
    try {
      const res = await fetch(`/.netlify/functions/fetch-checklist?set=${selectedSet}`);
      const data = await res.json();

      const specialRows = data.filter(card => card.name?.startsWith('__progress_'));
      const realCards = data.filter(card => card.name && !card.name.startsWith('__progress_') && !isNaN(parseInt(card.number)));

      realCards.forEach(card => {
        card.setCode = getSetCode(selectedSet);
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

  useEffect(() => {
    fetchCards(setName);
  }, [setName]);

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

  const filteredCards = cards.filter(card => {
  let collected = false;
  const rarity = card.rarity?.toLowerCase() || '';
  const number = parseInt(card.number);
  const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
  const isRare = rarity === 'rare';
  const isCommonOrUncommonOrRare = rarity === 'common'|| rarity === 'uncommon'|| rarity === 'rare';

  if (mode === 'base') {
    if (isCommonOrUncommon) {
      collected = card.standard === true;
    } else if (isRare) {
      collected = card.holoFoil === true;
    } else if(!isCommonOrUncommonOrRare){
      collected = card.holoFoil === true;
    }
  }

  if (mode === 'parallel') {
    if (isCommonOrUncommon) {
      collected = card.standard === true && card.reverseHolo === true;
    } else if (isRare) {
      collected = card.holoFoil === true && card.reverseHolo === true;
    } else if(!isCommonOrUncommonOrRare){
      collected = card.holoFoil === true;
    }
  }

  if (mode === 'master') {
    collected =
      card.standard === true &&
      card.reverseHolo === true &&
      card.holoFoil === true &&
      card.pokeball === true &&
      card.masterball === true;
  }

  if (hideCompleted && collected) return false;
  if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
  if ((mode === 'base' || mode === 'parallel') && number > BASE_COUNTS[setName]) return false;

  return true;
});


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
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 underline"
          >
            ← Back to Sets
          </button>

          <div>
            <label className="mr-2">Mode:</label>
            <label className="mr-2">
              <input type="radio" name="mode" value="base" checked={mode === 'base'} onChange={e => setMode(e.target.value)} /> Base
            </label>
            <label className="mr-2">
              <input type="radio" name="mode" value="parallel" checked={mode === 'parallel'} onChange={e => setMode(e.target.value)} /> Parallel
            </label>
            <label>
              <input type="radio" name="mode" value="master" checked={mode === 'master'} onChange={e => setMode(e.target.value)} /> Master
            </label>
          </div>

          <SearchBar value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards..."/>
          <label>
            <input type="checkbox" checked={hideCompleted} onChange={() => setHideCompleted(!hideCompleted)} /> Hide Completed
          </label>
          <span className="ml-auto text-blue-600 font-medium">
            {collectedCount} / {totalCount}
          </span>
        </div>
      </div>
      {loading ? <p className="text-center">Loading...</p> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredCards.map(card => (
            <Card key={card.name + card.number} card={card} mode={mode} onCheckboxChange={onCheckboxChange} />
          ))}
        </div>
      )}
    </div>
  );
}
