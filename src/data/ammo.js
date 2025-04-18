export const ammoTypes = {
  missile: {
    name: 'Missile',
    damage: 100,
  },
  superMissile: {
    name: 'Super Missile',
    damage: 300,
  },
};

export const calculateAmmoDamage = (ammoType, quantity, boss, isRidleyDoubleDamage = false, isMotherBrainDoubleDamage = false) => {
  let totalDamage = 0;
  const ammo = ammoTypes[ammoType];
  
  if (!ammo) return 0;

  // Special case: Super Missiles deal double damage to Ridley or Mother Brain if options are enabled
  if (ammoType === 'superMissile' && 
      ((boss === 'ridley' && isRidleyDoubleDamage) || 
       (boss === 'motherBrain' && isMotherBrainDoubleDamage))) {
    totalDamage = ammo.damage * 2 * quantity;
  } else {
    totalDamage = ammo.damage * quantity;
  }

  return totalDamage;
}; 