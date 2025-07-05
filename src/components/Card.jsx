import { Link } from 'react-router-dom';

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

function Card({ card, mode, onCheckboxChange }) {
  const rarity = card.rarity?.toLowerCase() || '';
  const type = card.type?.toLowerCase() || '';
  const number = parseInt(card.number);
  const baseLimit = BASE_COUNTS[card.setName];
  const isTrainer = type.includes('trainer');
  const isCommon = rarity === 'common';
  const isUncommon = rarity === 'uncommon';
  const isRare = rarity === 'rare';
  const isAceSpec = type.includes('ace spec');
  const isPrismatic = card.setCode === 'sv8pt5';

  const checkboxes = [];

  if (mode === 'base') {
    if (isAceSpec) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
    } else if (isPrismatic) {
      if (isCommon || isUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    } else {
      if (isCommon || isUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    }
  }

  if (mode === 'parallel') {
    if (isAceSpec) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
    } else if (isPrismatic) {
      if (isCommon || isUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
        checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
      } else if (isRare) {
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
        checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    } else {
      if (isCommon || isUncommon || isTrainer) {
        checkboxes.push({ label: 'Standard', key: 'standard' });
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
      } else if (isRare) {
        checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      } else {
        checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      }
    }
  }

  if (mode === 'master') {
    if (isAceSpec) {
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
    } else if ((isCommon || isUncommon) && number <= baseLimit) {
      checkboxes.push({ label: 'Standard', key: 'standard' });
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
      checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
      checkboxes.push({ label: 'Master Ball', key: 'masterball' });
    } else if (isTrainer && number <= baseLimit) {
      checkboxes.push({ label: 'Standard', key: 'standard' });
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
      checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
    } else if (isRare) {
      checkboxes.push({ label: 'Reverse Holo', key: 'reverseHolo' });
      checkboxes.push({ label: 'Holo Foil', key: 'holoFoil' });
      checkboxes.push({ label: 'Poké Ball', key: 'pokeball' });
      checkboxes.push({ label: 'Master Ball', key: 'masterball' });
    } else {
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
