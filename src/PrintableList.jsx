// src/PrintableList.jsx
import React, { useEffect, useState } from 'react';
import './index.css';

export default function PrintableList({ allCards, setName }) {
  const [missingCards, setMissingCards] = useState([]);

  useEffect(() => {
    const filtered = allCards.filter(card => {
      const rarity = card.rarity?.toLowerCase() || '';
      const number = parseInt(card.number);
      const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
      const isRare = rarity === 'rare';

      // Logic to determine if card is "incomplete"
      if (isCommonOrUncommon) {
        return !(card.standard && card.reverseHolo);
      } else if (isRare) {
        return !(card.holoFoil && card.reverseHolo);
      } else {
        return !card.holoFoil;
      }
    });

    setMissingCards(filtered);
  }, [allCards]);

  return (
    <div className="p-8 max-w-4xl mx-auto print:text-sm">
      <h1 className="text-2xl font-bold mb-6 text-center">Uncollected Cards – {setName}</h1>

      <table className="w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-left">#</th>
            <th className="border p-2 text-left">Name</th>
            <th className="border p-2 text-left">Rarity</th>
            <th className="border p-2 text-left">Missing</th>
          </tr>
        </thead>
        <tbody>
          {missingCards.map((card, index) => {
            const missing = [];
            if (!card.standard) missing.push('Standard');
            if (!card.reverseHolo) missing.push('Reverse');
            if (!card.holoFoil) missing.push('Holo');
            if (!card.pokeball) missing.push('Pokéball');
            if (!card.masterball) missing.push('Masterball');

            return (
              <tr key={index} className="border-t">
                <td className="border p-2">{card.number}</td>
                <td className="border p-2">{card.name}</td>
                <td className="border p-2">{card.rarity || '—'}</td>
                <td className="border p-2">{missing.join(', ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="mt-6 text-center text-gray-500">Total missing: {missingCards.length}</p>
    </div>
  );
}
