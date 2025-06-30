import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Card from './components/Card';
//import SetSelector from './components/SetSelector';
import './index.css';
import { Link } from 'react-router-dom';
import useSetLogos from './hooks/useSetLogos';


const BASE_COUNTS = {
  JourneyTogether: 159,
  TemporalForces: 162,
  ObsidianFlames: 197,
  PrismaticEvolutions: 131,
};

const MASTER_COUNTS = {
  JourneyTogether: 190,
  TemporalForces: 218,
  ObsidianFlames: 230,
  PrismaticEvolutions: 180,
};

const getSetCode = (setName) => ({
  JourneyTogether: 'sv9',
  TemporalForces: 'sv5',
  ObsidianFlames: 'sv3',
  PrismaticEvolutions: 'sv8pt5',
}[setName] || 'sv9');

export default function ChecklistPage() {
  const { setName: routeSetName } = useParams();
  const [setName, setSetName] = useState(routeSetName || 'JourneyTogether');
  const [cards, setCards] = useState([]);
  const [mode, setMode] = useState('base');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  
const { logos, loading: logosLoading } = useSetLogos();

  const fetchCards = async (selectedSet) => {
    setLoading(true);
    try {
      if (selectedSet === 'ALL') {
        const allSets = Object.keys(BASE_COUNTS);
        const results = await Promise.all(
          allSets.map(set =>
            fetch(`/.netlify/functions/fetch-checklist?set=${set}`)
              .then(res => res.json())
              .then(data => {
                const filtered = data.filter(card => card.name && !isNaN(parseInt(card.number)));
                filtered.forEach(card => {
                  card.setCode = getSetCode(set);
                  card.setName = set;
                });
                return filtered;
              })
          )
        );
        setCards(results.flat());
      } else {
        const res = await fetch(`/.netlify/functions/fetch-checklist?set=${selectedSet}`);
        const data = await res.json();
        const filtered = data.filter(card => card.name && !isNaN(parseInt(card.number)));
        filtered.forEach(card => {
          card.setCode = getSetCode(selectedSet);
          card.setName = selectedSet;
        });
        setCards(filtered);
      }
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards(setName);
  }, [setName]);

  const handleCheckboxChange = async (name, key, value) => {
    console.log('Saving checkbox:', name, key, value);

    setCards(prev =>
      prev.map(card => card.name === name ? { ...card, [key]: value } : card)
    );

    try {
      const response = await fetch('/.netlify/functions/save-checklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, [key]: value, set: setName })
      });

      const result = await response.text();
      console.log('Server response:', result);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const onCheckboxChange = (card, key) => {
    const saved = JSON.parse(localStorage.getItem(card.name)) || {};
    const updatedValue = !saved[key];
    localStorage.setItem(card.name, JSON.stringify({ ...saved, [key]: updatedValue }));
    handleCheckboxChange(card.name, key, updatedValue);
  };

  const filteredCards = cards.filter(card => {
    const saved = JSON.parse(localStorage.getItem(card.name)) || {};
    const collected = Object.values(saved).some(v => v === true);
  
    const rarity = card.rarity?.toLowerCase() || '';
    const number = parseInt(card.number);
  
    if (hideCompleted && collected) return false;
    if (search && !card.name.toLowerCase().includes(search.toLowerCase())) return false;
  
    const isRareOrHigher = ['rare', 'double rare', 'ultra rare', 'illustration rare', 'special illustration rare', 'hyper rare'].some(r => rarity.includes(r));
  
    if (mode === 'base' && number > BASE_COUNTS[setName]) return false;
    if (mode === 'parallel' && number > BASE_COUNTS[setName] && !isRareOrHigher) return false;
  
    return true;
  });
  

  const collectedCount = cards.filter(card => {
    const saved = JSON.parse(localStorage.getItem(card.name)) || {};
    if (mode === 'base') return saved.standard || saved.holoFoil;
    if (mode === 'parallel') return saved.standard || saved.reverseHolo || saved.holoFoil;
    if (mode === 'master') return Object.values(saved).some(v => v === true);
    return false;
  }).length;

  const totalCount = mode === 'base' ? BASE_COUNTS[setName] :
                     mode === 'parallel' ? BASE_COUNTS[setName] * 2 :
                     MASTER_COUNTS[setName];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="sticky top-0 bg-white z-10 shadow p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-center">
        {setName !== 'ALL' && !logosLoading && logos[getSetCode(setName)] && (
          <div className="mb-4 text-center">
            <img
              src={logos[getSetCode(setName)]}
              alt={`${setName} logo`}
              className="mx-auto max-h-24"
            />
          </div>
        )}
        <Link to="/" className="text-blue-600 underline hover:text-blue-800">
          ← Back to Sets
        </Link>
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
          <input
            type="text"
            placeholder="Search..."
            className="border rounded px-2 py-1"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              className="mr-1"
              checked={setName === 'ALL'}
              onChange={(e) => setSetName(e.target.checked ? 'ALL' : 'JourneyTogether')}
            />
            All
          </label>
          <label>
            <input type="checkbox" checked={hideCompleted} onChange={() => setHideCompleted(!hideCompleted)} /> Hide Completed
          </label>
          <span className="ml-auto text-blue-600 font-medium">
            {collectedCount} / {totalCount}
          </span>
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