// Card.jsx
function Card({ card, mode, onCheckboxChange }) {
  const rarity = card.rarity?.toLowerCase() || '';
  const type = card.type?.toLowerCase() || '';
  const number = parseInt(card.number);
  const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
  const isRare = rarity === 'rare';
  const isDoubleRare = rarity === 'double rare';
  const isUltraRare = rarity==='ultra rare';
  const isTrainer = type.includes('trainer');
  const isAceSpec = type.includes('ace spec');
  const isPrismatic = card.setCode === 'sv8pt5';

  const checkboxes = [];

  if (mode === 'base') {
    if (isCommonOrUncommon || isTrainer) {
      checkboxes.push({ label: 'Standard', key: 'standard' });
    } else if (isRare || isAceSpec || !isCommonOrUncommon) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
    }
  }

  if (mode === 'parallel') {
    if (isCommonOrUncommon || isTrainer) {
      checkboxes.push({ label: 'Standard', key: 'standard' });
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
    } 
    else if (isRare) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
    }
    else if (isDoubleRare) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
    }

    if (isPrismatic) {
        if (isCommonOrUncommon || isTrainer || isRare) {
          checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
          checkboxes.push({ label: 'Master Ball', key: 'masterball' });
        }    
    }
  }

  if (mode === 'master') {
    if (isCommonOrUncommon || (isTrainer && isCommonOrUncommon) ) {
      checkboxes.push({ label: 'Standard', key: 'standard' });
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
    }
    if (!isCommonOrUncommon && !isRare && isTrainer && isUltraRare ) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
    }
    if (isRare) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
    }
    if (!isCommonOrUncommon && !isRare && !isTrainer) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
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
