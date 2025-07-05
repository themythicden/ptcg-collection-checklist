
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

  const fetchCards = async () => {
    try {
      const res = await fetch(`/.netlify/functions/fetch-checklist?set=${setName}`);
      const data = await res.json();
      const baseCount = BASE_COUNTS[setName] || 0;

      const filtered = data.filter(card => {
        if (!card.name || isNaN(parseInt(card.number)) || card.name.startsWith('__progress_')) return false;

        const rarity = card.rarity?.toLowerCase() || '';
        const number = parseInt(card.number);
        const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
        const isRare = rarity === 'rare';
        const isTrainer = card.type?.toLowerCase().includes('trainer');

        // Same logic used for "collected"
        if (isCommonOrUncommon) {
          return !(card.standard && card.reverseHolo && card.pokeball && card.masterball);
        } else if (isRare) {
          return !(card.holoFoil && card.reverseHolo && card.pokeball && card.masterball);
        } else if (isTrainer && number <= baseCount) {
          return !(card.standard && card.reverseHolo && card.pokeball);
        } else {
          return !card.holoFoil;
        }
      });

      setCards(filtered);
    } catch (err) {
      console.error('Error fetching cards:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
    setTimeout(() => window.print(), 800); // Auto trigger print after load
  }, []);

  if (loading) return <p className="text-center mt-8">Generating list...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto print:p-0 print:m-0 print:w-full">
      <h1 className="text-2xl font-bold mb-4 text-center print:text-left">
        Missing Cards – {setName.replace(/([A-Z])/g, ' $1')}
      </h1>
      <table className="w-full table-auto border-collapse text-sm print:text-xs">
  <thead>
    <tr className="bg-gray-200">
      <th className="border px-2 py-1 text-left">#</th>
      <th className="border px-2 py-1 text-left">Name</th>
      <th className="border px-2 py-1 text-left">Rarity</th>
      <th className="border px-2 py-1 text-left">Type</th>
      <th className="border px-2 py-1 text-left">Missing Variants</th>
      <th className="border px-2 py-1 text-left">Set</th>
    </tr>
  </thead>
  <tbody>
    {cards.map((card, idx) => {
      const rarity = card.rarity?.toLowerCase() || '';
      const type = card.type?.toLowerCase() || '';
      const number = parseInt(card.number);
      const isTrainer = type.includes('trainer');
      const isAceSpec = type.includes('ace spec');
      const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
      const isRare = rarity === 'rare';
      const isPrismatic = setName === 'PrismaticEvolutions';
      const baseCount = BASE_COUNTS[setName] || 0;

      // Expected variants
      let expected = [];

if (isAceSpec) {
  expected = ['holoFoil'];
} else if (isPrismatic) {
  if ((isCommonOrUncommon || isTrainer) && number <= baseCount) {
    expected = ['standard', 'reverseHolo', 'pokeball', 'masterball'];
  } else if (isRare) {
    expected = ['reverseHolo', 'holoFoil', 'pokeball', 'masterball'];
  } else if (isTrainer && number <= baseCount) {
    expected = ['standard', 'reverseHolo', 'pokeball'];
  } else {
    expected = ['holoFoil'];
  }
} else {
  if ((isCommonOrUncommon || isTrainer) && number <= baseCount) {
    expected = ['standard', 'reverseHolo'];
  } else if (isRare) {
    expected = ['reverseHolo', 'holoFoil'];
  } else if (isTrainer && number <= baseCount) {
    expected = ['standard', 'reverseHolo'];
  } else {
    expected = ['holoFoil'];
  }
}


      const missing = expected.filter(key => card[key] !== true);

      return (
        <tr key={card.name + card.number} className={idx % 2 ? 'bg-gray-100' : ''}>
          <td className="border px-2 py-1">{card.number}</td>
          <td className="border px-2 py-1">{card.name}</td>
          <td className="border px-2 py-1 capitalize">{card.rarity}</td>
          <td className="border px-2 py-1 capitalize">{card.type}</td>
          <td className="border px-2 py-1">{missing.join(', ')}</td>
          <td className="border px-2 py-1">{setName}</td>
        </tr>
      );
    })}
  </tbody>
</table>

      <p className="mt-4 text-sm text-gray-500">Total missing: {cards.length}</p>
    </div>
  );
}
