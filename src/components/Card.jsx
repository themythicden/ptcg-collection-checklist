 import { Link } from 'react-router-dom';

function Card({ card, mode, onCheckboxChange }) {
  const rarity = card.rarity?.toLowerCase() || '';
  const type = card.type?.toLowerCase() || '';
  const number = parseInt(card.number);
  const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
  const isRare = rarity === 'rare';
  const isAceSpec = rarity ==='acespecrare';
  const isTrainer = type.includes('trainer');
  
  const isPrismatic = card.setCode === 'sv8pt5';
  const baseCount = {
    PrismaticEvolutions: 131,
    // Add other sets here if needed
  }[card.setName] || 0;

  const checkboxes = [];

  // --- BASE MODE ---
  if (mode === 'base') {
    if (isPrismatic) {
      if (isCommonOrUncommon) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    } else {
      if (isCommonOrUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    }
  }

  // --- PARALLEL MODE ---
  if (mode === 'parallel') {
    if (isPrismatic) {
      if (isCommonOrUncommon) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
        checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
      } else if (isRare) {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
        checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    } else {
      if (isCommonOrUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
      } else if (isRare) {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    }
  }

  // --- MASTER MODE ---
  if (mode === 'master') {
    if (isPrismatic) {
      if (isCommonOrUncommon) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
        checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
        checkboxes.push({ label: 'Master Ball', key: 'masterball' });
      } else if (isRare) {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
        checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
        checkboxes.push({ label: 'Master Ball', key: 'masterball' });
      } else {
        // special case: trainer card <= baseCount → no masterball
        if (isTrainer && number <= baseCount) {
          checkboxes.push({ label: 'Standard', key: 'standard' });
          checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
          checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
        } 
        else if (isTrainer && isAceSpec){
          checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
        }
        
        else {
          checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
        }
      }
    } else {
      // Default master mode for non-Prismatic sets
      checkboxes.push({ label: 'Standard', key: 'standard' });
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
      checkboxes.push({ label: 'Master Ball', key: 'masterball' });
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
