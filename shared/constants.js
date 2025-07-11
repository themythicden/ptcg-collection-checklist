// ✅ REBUILD START: Clean structure for PTCG Checklist with working Netlify + Google Sheets + Constants

// 1. === shared/constants.js ===
export const BASE_COUNTS = {
  DestinedRivals: 182,
  JourneyTogether: 159,
  PrismaticEvolutions: 131,
  SurgingSparks: 191,
  StellarCrown: 142,
  ShroudedFable: 64,
  TwilightMasquerade: 167,
  TemporalForces: 162,
  PaldeanFates: 91,
  ParadoxRift: 182,
  "151": 165,
  ObsidianFlames: 197,
  PaldeaEvolved: 193,
  ScarletViolet: 198,
  SilverTempest: 195,
  Evolutions: 108,
  SteamSiege: 114,
  FatesCollide: 124
};

export const MASTER_COUNTS = {
  DestinedRivals: 244,
  JourneyTogether: 190,
  PrismaticEvolutions: 180,
  SurgingSparks: 252,
  StellarCrown: 175,
  ShroudedFable: 95,
  TwilightMasquerade: 226,
  TemporalForces: 218,
  PaldeanFates: 123,
  ParadoxRift: 266,
  "151": 207,
  ObsidianFlames: 230,
  PaldeaEvolved: 279,
  ScarletViolet: 258,
  SilverTempest: 215,
  Evolutions: 113,
  SteamSiege: 116,
  FatesCollide: 125
};

export const SET_CODES = {
  DestinedRivals: 'sv10',
  JourneyTogether: 'sv9',
  PrismaticEvolutions: 'sv8pt5',
  SurgingSparks: 'sv8',
  StellarCrown: 'sv7',
  ShroudedFable: 'sv6pt5',
  TwilightMasquerade: 'sv6',
  TemporalForces: 'sv5',
  PaldeanFates: 'sv4pt5',
  ParadoxRift: 'sv4',
  "151": 'sv3pt5',
  ObsidianFlames: 'sv3',
  PaldeaEvolved: 'sv2',
  ScarletViolet: 'sv1',
  SilverTempest: 'swsh12',
  Evolutions: 'xy12',
  SteamSiege: 'xy11'
  FatesCollide: 'xy10'
};

export const SET_NAME_MAP = Object.fromEntries(
  Object.entries(SET_CODES).map(([name, code]) => [code, name])
);

export const SHEET_NAMES = Object.fromEntries(
  Object.keys(SET_CODES).map((key) => [key, key])
);

export const DISPLAY_NAMES = {
  ScarletViolet: 'Scarlet & Violet',
  "151": '151'
};

export function formatSetName(name) {
  return DISPLAY_NAMES[name] || name.replace(/([A-Z])/g, ' $1').trim();
}
