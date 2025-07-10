import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BASE_COUNTS,
  SET_CODES,
  formatSetName
} from '../constants';

export default function PrintPage() {
  const { setName } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseCount = BASE_COUNTS[setName];
  const isPrismatic = setName === 'PrismaticEvolutions';

  useEffect(() => {
    const fetchCards = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/.netlify/functions/fetch-checklist?set=${setName}`);
        const data = await res.json();

        const realCards = data.filter(card =>
          card.name &&
          !card.name.startsWith('__progress_') &&
          !isNaN(parseInt(card.number))
        );

        const missing = realCards
          .map(card => {
            const rarity = card.rarity?.toLowerCase() || '';
            const type = card.type?.toLowerCase() || '';
            const number = parseInt(card.number);
            const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
            const isRare = rarity === 'rare';
            const isTrainer = type.includes('trainer');
            const isAceSpec = rarity.includes('ace spec');

            const variants = [];

            if (isAceSpec) {
              if (!card.holoFoil) variants.push('Holo Foil');
              return variants.length ? { ...card, missing: variants } : null;
            }

            if (isPrismatic) {
              if (isCommonOrUncommon) {
                if (!card.standard) variants.push('Standard');
                if (!card.reverseHolo) variants.push('Reverse Holo');
                if (!card.pokeball) variants.push('Poké Ball');
                if (!card.masterball) variants.push('Master Ball');
              } else if (isRare) {
                if (!card.holoFoil) variants.push('Holo Foil');
                if (!card.reverseHolo) variants.push('Reverse Holo');
                if (!card.pokeball) variants.push('Poké Ball');
                if (!card.masterball) variants.push('Master Ball');
              } else if (isTrainer && number <= baseCount) {
                if (!card.standard) variants.push('Standard');
                if (!card.reverseHolo) variants.push('Reverse Holo');
                if (!card.pokeball) variants.push('Poké Ball');
              } else {
                if (!card.holoFoil) variants.push('Holo Foil');
              }
            } else {
              if (isCommonOrUncommon || (isTrainer && number <= baseCount)) {
                if (!card.standard) variants.push('Standard');
                if (!card.reverseHolo) variants.push('Reverse Holo');
              } else if (isRare) {
                if (!card.holoFoil) variants.push('Holo Foil');
                if (!card.reverseHolo) variants.push('Reverse Holo');
              } else {
                if (!card.holoFoil) variants.push('Holo Foil');
              }
            }

            return variants.length ? { ...card, missing: variants } : null;
          })
          .filter(Boolean);

        setCards(missing);
      } catch (err) {
        console.error('Error fetching cards:', err);
      }
      setLoading(false);
    };

    fetchCards();
  }, [setName]);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => window.print(), 600);
    }
  }, [loading]);

  if (loading) return <p className="text-center mt-8">Generating list...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto print:p-0 print:m-0 print:w-full">
      <h1 className="text-2xl font-bold mb-4 text-center print:text-left">
        Missing Cards – {formatSetName(setName)}
      </h1>

      <table className="w-full table-auto border-collapse text-sm print:text-xs">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1 text-left">#</th>
            <th className="border px-2 py-1 text-left">Name</th>
            <th className="border px-2 py-1 text-left">Rarity</th>
            <th className="border px-2 py-1 text-left">Type</th>
            <th className="border px-2 py-1 text-left">Missing Variants</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card, idx) => (
            <tr key={card.name + card.number} className={idx % 2 ? 'bg-gray-100' : ''}>
              <td className="border px-2 py-1">{card.number}</td>
              <td className="border px-2 py-1">{card.name}</td>
              <td className="border px-2 py-1 capitalize">{card.rarity}</td>
              <td className="border px-2 py-1 capitalize">{card.type}</td>
              <td className="border px-2 py-1">{card.missing.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-4 text-sm text-gray-500">
        Total missing: {cards.length} cards
      </p>
    </div>
  );
}
