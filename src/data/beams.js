export const beams = {
  power: {
    name: 'Power Beam',
    baseDamage: 20,
    isDefault: true,
  },
  ice: {
    name: 'Ice Beam',
    baseDamage: 30,
    modifier: 1,
  },
  spazer: {
    name: 'Spazer Beam',
    baseDamage: 30,
    modifier: 1,
  },
  wave: {
    name: 'Wave Beam',
    baseDamage: 30,
    modifier: 1,
  },
  plasma: {
    name: 'Plasma Beam',
    baseDamage: 150,
    modifier: 1,
  },
  charge: {
    name: 'Charge Beam',
    modifier: 3,
    isModifier: true,
  },
};

export const calculateDamage = (selectedBeams) => {
  let baseDamage = beams.power.baseDamage; // Power beam is always present
  let totalModifier = 1;

  // First check for three-beam combinations
  if (selectedBeams.includes('ice') && selectedBeams.includes('wave') && selectedBeams.includes('spazer')) {
    baseDamage = 100;
  } else if (selectedBeams.includes('ice') && selectedBeams.includes('wave') && selectedBeams.includes('plasma')) {
    baseDamage = 300;
  } 
  // Then check for two-beam combinations
  else if (selectedBeams.includes('ice') && selectedBeams.includes('spazer')) {
    baseDamage = 60;
  } else if (selectedBeams.includes('ice') && selectedBeams.includes('wave')) {
    baseDamage = 60;
  } else if (selectedBeams.includes('wave') && selectedBeams.includes('spazer')) {
    baseDamage = 60;
  } else if (selectedBeams.includes('ice') && selectedBeams.includes('plasma')) {
    baseDamage = 200;
  } else if (selectedBeams.includes('wave') && selectedBeams.includes('plasma')) {
    baseDamage = 250;
  } 
  // Finally, handle single beam or no special combination
  else {
    // Calculate base damage from stacking beams for non-special combinations
    for (const beamKey of selectedBeams) {
      const beam = beams[beamKey];
      if (!beam.isModifier && beamKey !== 'power') {
        baseDamage = Math.max(baseDamage, beam.baseDamage);
        if (beam.modifier) {
          totalModifier *= beam.modifier;
        }
      }
    }
  }

  // Apply charge beam if selected
  if (selectedBeams.includes('charge')) {
    totalModifier *= beams.charge.modifier;
  }

  return Math.floor(baseDamage * totalModifier);
}; 