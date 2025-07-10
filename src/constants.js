// constants.js

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
  SteamSiege: 114
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
  SteamSiege: 116
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
  SteamSiege: 'xy11'
};

export const SET_NAME_MAP = {
  sv10: 'DestinedRivals',
  sv9: 'JourneyTogether',
  sv8pt5: 'PrismaticEvolutions',
  sv8: 'SurgingSparks',
  sv7: 'StellarCrown',
  sv6pt5: 'ShroudedFable',
  sv6: 'TwilightMasquerade',
  sv5: 'TemporalForces',
  sv4pt5: 'PaldeanFates',
  sv4: 'ParadoxRift',
  sv3pt5: '151',
  sv3: 'ObsidianFlames',
  sv2: 'PaldeaEvolved',
  sv1: 'Scarlet&Violet',
  swsh12: 'SilverTempest',
  xy11: 'SteamSiege'
};

export const SHEET_NAMES = {
  "Scarlet&Violet": "Scarlet&Violet", // ✅ quoted key
  
  DestinedRivals: 'DestinedRivals',
  JourneyTogether: 'JourneyTogether',
  PrismaticEvolutions: 'PrismaticEvolutions',
  SurgingSparks: 'SurgingSparks',
  StellarCrown: 'StellarCrown',
  ShroudedFable: 'ShroudedFable',
  TwilightMasquerade: 'TwilightMasquerade',
  TemporalForces: 'TemporalForces',
  PaldeanFates: 'PaldeanFates',
  ParadoxRift: 'ParadoxRift',
  "151": '151',
  ObsidianFlames: 'ObsidianFlames',
  PaldeaEvolved: 'PaldeaEvolved',
  ScarletViolet: 198,
  SilverTempest: 'SilverTempest',
  SteamSiege: 'SteamSiege'
};
export const DISPLAY_NAMES = {
  ScarletViolet: 'Scarlet & Violet',
  "151": '151'
  // other sets match their key, so no need to include unless formatting needed
};

// Utility function to get formatted set name
export const formatSetName = (name) => DISPLAY_NAMES[name] || name.replace(/([A-Z])/g, ' $1').trim();
