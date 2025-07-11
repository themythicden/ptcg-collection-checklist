import { Link } from 'react-router-dom';
import { BASE_COUNTS } from '../constants';

function Card({ card, mode, onCheckboxChange }) {
  const rarity = card.rarity?.toLowerCase() || '';
  const type = card.type?.toLowerCase() || '';
  const number = parseInt(card.number);
  const isCommonOrUncommon = rarity === 'common' || rarity === 'uncommon';
  const isRare = rarity === 'rare';
  const isRareHolo = rarity === 'rare holo';
  const isRareHoloEX = rarity === 'rare holo ex';
  const isBreak = rarity === 'rare break';
  const isRareUltra = rarity === 'rare ultra';
  const isRareSecret = rarity === 'rare secret';
  const isAceSpec = rarity.includes('ace spec');
  const isTrainer = type.includes('trainer');
  const isPrismatic = card.setCode === 'sv8pt5';
  const isXY = card.setCode ==='xy10' || card.setCode ==='xy11' || card.setCode === 'xy12';
  const isEvolutions = card.setCode === 'xy12';
  const baseLimit = BASE_COUNTS[card.setName] || 0;

  const checkboxes = [];

  const add = (key, label) => checkboxes.push({ key, label });

  //BASE
  if (mode === 'base') {
  if (isPrismatic) {
    if (isCommonOrUncommon || isTrainer) {
      add('standard', 'Standard');
    } else {
      add('holoFoil', 'Holo Foil');
    }
  } else if (isXY) {
    if (isRareSecret) {
      add('standard', 'Standard');
    } else if (isRare) {
      add('standard', 'Standard');
    } else if (isCommonOrUncommon) {
      add('standard', 'Standard');
    } else if (!isCommonOrUncommon && !isRare && !isRareSecret) {
      add('holoFoil', 'Holo Foil');
    }
    // Otherwise, do not add Holo Foil for Commons/Rares
  } else {
    if (isAceSpec || (!isCommonOrUncommon && !isRare && !isTrainer)) {
      add('holoFoil', 'Holo Foil');
    } else if (isCommonOrUncommon || isTrainer) {
      add('standard', 'Standard');
    } else if (isRare) {
      add('holoFoil', 'Holo Foil');
    }
  }
}

  //PARALLEL
  if (mode === 'parallel') {
    if (isPrismatic) {
      if (isCommonOrUncommon || isTrainer) {
        add('standard', 'Standard');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball');
      } else if (isRare) {
        add('holoFoil', 'Holo Foil');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball');
      } else {
        add('holoFoil', 'Holo Foil');
      }
    } else if (isXY) {
        if (isCommonOrUncommon){
          add('standard', 'Standard');
          add('reverseHolo', 'Reverse Holo');
        } else if (isRare) {
          add('standard', 'Standard');
          add('reverseHolo', 'Reverse Holo');
        } else if (isRareHolo){
          add('holoFoil', 'Holo Foil');
          add('reverseHolo', 'Reverse Holo');
        } else if (isRareSecret) {
          add('standard', 'Standard');
        } else if (isBreak || isRareUltra || isRareHoloEX){
          add('holoFoil', 'Holo Foil');
        } else if (!isCommonOrUncommon && !isRare && !isRareSecret && !isRareHolo) {
          add('holoFoil', 'Holo Foil');
        }
      }  else {
        if (isAceSpec || (!isCommonOrUncommon && !isRare && !isTrainer)) {
          add('holoFoil', 'Holo Foil');
        } else if (isCommonOrUncommon || isTrainer) {
          add('standard', 'Standard');
          add('reverseHolo', 'Reverse Holo');
        } else if (isRare) {
          add('holoFoil', 'Holo Foil');
          add('reverseHolo', 'Reverse Holo');
        }
      }
  }

  //MASTER
  if (mode === 'master') {
    if (isPrismatic) {
      if (isAceSpec || (!isCommonOrUncommon && !isRare && !isTrainer)) {
        add('holoFoil', 'Holo Foil');
      } else if (isCommonOrUncommon) {
        add('standard', 'Standard');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball');
        add('masterball', 'Master Ball');
      } else if (isRare) {
        add('holoFoil', 'Holo Foil');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball');
        add('masterball', 'Master Ball');
      } else if (isTrainer && number <= baseLimit) {
        add('standard', 'Standard');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball'); // ❌ no masterball for trainers <= base
      } else {
        add('holoFoil', 'Holo Foil');
      }
    } else if (isEvolutions) {
        if (isCommonOrUncommon){
          add('standard', 'Standard');
          add('reverseHolo', 'Reverse Holo');
        } else if (isRare) {
          add('standard', 'Standard');
          add('reverseHolo', 'Reverse Holo');
        } else if (isRareHolo){
          add('holoFoil', 'Holo Foil');
          add('reverseHolo', 'Reverse Holo');
        } else if (isRareSecret) {
          add('standard', 'Standard');
        } else if (isBreak || isRareUltra || isRareHoloEX){
          add('holoFoil', 'Holo Foil');
        } else if (!isCommonOrUncommon && !isRare && !isRareSecret && !isRareHolo) {
          add('holoFoil', 'Holo Foil');
        }
      } else {
      if ((isCommonOrUncommon || isTrainer) && number <= baseLimit) {
        add('standard', 'Standard');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball');
        add('masterball', 'Master Ball');
      } else if (isRare) {
        add('holoFoil', 'Holo Foil');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball');
        add('masterball', 'Master Ball');
      } else if (isTrainer && number <= baseLimit) {
        add('standard', 'Standard');
        add('reverseHolo', 'Reverse Holo');
        add('pokeball', 'Poké Ball'); // ❌ no masterball
      } else {
        add('holoFoil', 'Holo Foil');
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
          #{card.number} – {card.rarity}
        </p>
        <div className="mt-2 flex flex-col gap-1 text-sm">
          {checkboxes.map(({ key, label }) => (
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
