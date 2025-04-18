export const bosses = {
  kraid: {
    name: 'Kraid',
    health: 1000,
  },
  phantoon: {
    name: 'Phantoon',
    health: 2500,
  },
  draygon: {
    name: 'Draygon',
    health: 6000,
  },
  ridley: {
    name: 'Ridley',
    health: 18000,
  },
  motherBrain: {
    name: 'Mother Brain',
    health: 18000,
  },
};

export const calculateEffectiveDamage = (damage, boss, selectedBeams) => {
  // No more weaknesses or resistances, just return the base damage
  return damage;
}; 