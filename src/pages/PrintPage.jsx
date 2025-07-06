import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
  PaldeaEvolved: 193,
  ScarletViolet: 198,
  SilverTempest: 195
};

export default function PrintPage() {
  const { setName } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch(`/.netlify/functions/fetch-checklist?set=${setName}`);
        const data = await res.json();
        const baseCount = BASE_COUNTS[setName] || 0;
        const isPrismatic = setName === 'PrismaticEvolutions';

        const filtered = data
          .filter(card => card.name && !card.name.startsWith('__progress_') && !isNaN(parseInt(card.number)))
          .map(card => {
            const rarity = card.rarity?.toLowerCase() || '';
            const number = parseInt(card.number);
            const type = card.type?.toLowerCase() || '';
            const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
            const isRare = rarity === 'rare';
            const isTrainer = type.includes('trainer');
            const isAceSpec = type.includes('ace spec');

            let expected = [];

            // Prismatic logic
            if (isPrismatic) {
              if (isCommonOrUncommon) {
                expected = ['standard', 'reverseHolo', 'pokeball', 'masterball'];
              } else if (isRare) {
                expected = ['reverseHolo', 'holoFoil', 'pokeball', 'masterball'];
              } else if (isTrainer && number <= baseCount) {
                expected = ['standard', 'reverseHolo', 'pokeball'];
              } else {
                expected = ['holoFoil'];
              }
            } else {
              // Normal logic
              if (isAceSpec) {
                expected = ['holoFoil'];
              } else if ((isCommonOrUncommon || isTrainer) && number <= baseCount) {
                expected = ['standard', 'reverseHolo'];
              } else if (isRare) {
                expected = ['reverseHolo', 'holoFoil'];
              } else {
                expected = ['holoFoil'];
              }
            }

            // Get missing variants
            const missing = expected.filter(variant => card[variant] !== true);

            return missing.length > 0 ? { ...card, missing } : null;
          })
          .filter(Boolean);

        setCards(filtered);
        setLoading(false);

        // Trigger print after cards are loaded
        setTimeout(() => window.print(), 300);
      } catch (err) {
        console.error('Error fetching cards:', err);
        setLoading(false);
      }
    };

    fetchCards();
  }, [setName]);

  if (loading) return <p className="text-center mt-8">Generating list...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto print:p-0 print:m-0 print:w-full">
      <h1 className="text-2xl font-bold mb-4 text-center print:text-left">
        Missing Cards – {setName.replace(/([A-Z])/g, ' $1')}
      </h1>
      <table className="w-full table-auto border-collapse text-sm print:text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1 text-left">#</th>
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1 text-left">Rarity</th>
            <th className="border px-2 py-1 text-left">Missing Variants</th>
            <th className="border px-2 py-1 text-left">Type</th>
            <th className="border px-2 py-1 text-left">Set</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, idx) => (
            <tr key={card.name + card.number} className={idx % 2 ? 'bg-gray-100' : ''}>
              <td className="border px-2 py-1">{card.number}</td>
              <td className="border px-2 py-1">{card.name}</td>
              <td className="border px-2 py-1 capitalize">{card.rarity}</td>
              <td className="border px-2 py-1">{card.missing.map(v => variantLabel(v)).join(', ')}</td>
              <td className="border px-2 py-1 capitalize">{card.type}</td>
              <td className="border px-2 py-1">{setName}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-gray-500">Total missing: {cards.length}</p>
    </div>
  );
}

// Helper to convert keys to labels
function variantLabel(key) {
  const map = {
    standard: 'Standard',
    reverseHolo: 'Reverse Holo',
    holoFoil: 'Holo Foil',
    pokeball: 'Poké Ball',
    masterball: 'Master Ball'
  };
  return map[key] || key;
}
