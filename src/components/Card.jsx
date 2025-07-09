import { Link } from 'react-router-dom';
import { BASE_COUNTS } from '../constants';

function Card({ card, mode, onCheckboxChange }) {
  const rarity = card.rarity?.toLowerCase() || '';
  const type = card.type?.toLowerCase() || '';
  const number = parseInt(card.number);
  const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
  const isRare = rarity === 'rare';
  const isTrainer = type.includes('trainer');
  const isAceSpec = rarity.includes('ace spec');
  const isPrismatic = card.setCode === 'sv8pt5';
  const baseLimit = BASE_COUNTS[card.setName];

  const checkboxes = [];

  if (mode === 'base') {
    if (isPrismatic) {
      if (isCommonOrUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    } else {
      if (isAceSpec || (!isCommonOrUncommon && !isRare && !isTrainer)) {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      } else if (isCommonOrUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
      } else if (isRare) {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    }
  }

  if (mode === 'parallel') {
    if (isPrismatic) {
      if (isCommonOrUncommon || isTrainer) {
        checkboxes.push(
          { label: 'Standard', key: 'standard' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' }
        );
      } else if (isRare) {
        checkboxes.push(
          { label: 'Holo Foil', key: 'holoFoil' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' }
        );
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    } else {
      if (isAceSpec || (!isCommonOrUncommon && !isRare && !isTrainer)) {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      } else if (isCommonOrUncommon || isTrainer) {
        checkboxes.push(
          { label: 'Standard', key: 'standard' },
          { label: 'Reverse Holo', key: 'reverseHolo' }
        );
      } else if (isRare) {
        checkboxes.push(
          { label: 'Holo Foil', key: 'holoFoil' },
          { label: 'Reverse Holo', key: 'reverseHolo' }
        );
      }
    }
  }

  if (mode === 'master') {
    if (isAceSpec || (!isCommonOrUncommon && !isRare && !isTrainer)) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
    } else if (isPrismatic) {
      if (isCommonOrUncommon) {
        checkboxes.push(
          { label: 'Standard', key: 'standard' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' },
          { label: 'Master Ball', key: 'masterball' }
        );
      } else if (isRare) {
        checkboxes.push(
          { label: 'Holo Foil', key: 'holoFoil' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' },
          { label: 'Master Ball', key: 'masterball' }
        );
      } else if (isTrainer && number <= baseLimit) {
        checkboxes.push(
          { label: 'Standard', key: 'standard' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' }
        );
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    } else {
      if ((isCommonOrUncommon || isTrainer) && number <= baseLimit) {
        checkboxes.push(
          { label: 'Standard', key: 'standard' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' },
          { label: 'Master Ball', key: 'masterball' }
        );
      } else if (isRare) {
        checkboxes.push(
          { label: 'Holo Foil', key: 'holoFoil' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' },
          { label: 'Master Ball', key: 'masterball' }
        );
      } else if (isTrainer && number <= baseLimit) {
        checkboxes.push(
          { label: 'Standard', key: 'standard' },
          { label: 'Reverse Holo', key: 'reverseHolo' },
          { label: 'Poké Ball', key: 'pokeball' }
        );
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    }
  }

  return (
    <div className="bg-white shadow rounded-xl p-4 flex gap-4 card">
      <img
        src={`https://images.pokemontcg.io/${card.setCode}/${card.number}.png`}
        alt={card.name}
        className="w-24 h-auto"
      />
      <div>
        <h2 className="text-lg font-bold">{card.name}</h2>
        <Link to={`/set/${card.setName}`} className="text-sm text-blue-500 underline">
          {card.setName}
        </Link>
        <p className="text-sm text-gray-500">
          #{card.number} - {card.rarity}
        </p>
        <div className="mt-2 flex flex-col gap-1 text-sm">
          {checkboxes.map(({ label, key }) => (
            <label key={key} className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={!!card[key]}
                onChange={() => onCheckboxChange(card, key)}
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Card;
