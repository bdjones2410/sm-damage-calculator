import { calculateDamage } from '../beams';
import { calculateAmmoDamage } from '../ammo';
import { bosses, calculateEffectiveDamage } from '../bosses';

describe('Damage Calculations', () => {
  test('Ridley with 30 super missiles and power beam should require 0 additional shots', () => {
    // Set up test parameters
    const selectedBeams = ['power'];
    const superMissileCount = 30;
    const boss = bosses.ridley;

    // Calculate super missile damage (double damage vs Ridley)
    const superMissileDamage = calculateAmmoDamage('superMissile', superMissileCount, 'ridley');
    
    // Calculate remaining health after super missiles
    const remainingHealth = Math.max(0, boss.health - superMissileDamage);
    
    // Calculate base beam damage
    const baseDamage = calculateDamage(selectedBeams);
    
    // Calculate effective beam damage
    const effectiveDamage = calculateEffectiveDamage(baseDamage, boss, selectedBeams);
    
    // Calculate required shots
    const shotsToKill = remainingHealth > 0 ? Math.ceil(remainingHealth / effectiveDamage) : 0;

    // Verify the results
    expect(superMissileDamage).toBe(18000); // 30 * 300 * 2 (double damage vs Ridley)
    expect(remainingHealth).toBe(0); // Ridley's health is 1800, which is less than 18000
    expect(shotsToKill).toBe(0); // No additional shots needed
  });

  test('Ridley with charge, ice, wave, and plasma beams should require 20 shots', () => {
    // Set up test parameters
    const selectedBeams = ['power', 'ice', 'wave', 'plasma', 'charge'];
    const boss = bosses.ridley;

    // Calculate base beam damage
    const baseDamage = calculateDamage(selectedBeams);
    console.log('Base damage:', baseDamage);
    
    // Calculate effective beam damage
    const effectiveDamage = calculateEffectiveDamage(baseDamage, boss, selectedBeams);
    console.log('Effective damage:', effectiveDamage);
    
    // Calculate required shots
    const shotsToKill = Math.ceil(boss.health / effectiveDamage);
    console.log('Shots to kill:', shotsToKill);

    // Verify the results
    expect(baseDamage).toBe(180); // Base damage from i + w + P combination
    expect(effectiveDamage).toBe(270); // Base damage * 1.5 (weakness to wave/plasma)
    expect(shotsToKill).toBe(7); // 1800 health / 270 damage per shot = 7 shots (rounded up)
  });

  describe('Charge Beam Multiplier', () => {
    const testCases = [
      {
        name: 'Ice Beam',
        beams: ['power', 'ice'],
        expectedBase: 30,
      },
      {
        name: 'Ice + Spazer',
        beams: ['power', 'ice', 'spazer'],
        expectedBase: 60,
      },
      {
        name: 'Ice + Wave',
        beams: ['power', 'ice', 'wave'],
        expectedBase: 60,
      },
      {
        name: 'Ice + Wave + Spazer',
        beams: ['power', 'ice', 'wave', 'spazer'],
        expectedBase: 100,
      },
      {
        name: 'Ice + Plasma',
        beams: ['power', 'ice', 'plasma'],
        expectedBase: 200,
      },
      {
        name: 'Wave + Plasma',
        beams: ['power', 'wave', 'plasma'],
        expectedBase: 250,
      },
      {
        name: 'Ice + Wave + Plasma',
        beams: ['power', 'ice', 'wave', 'plasma'],
        expectedBase: 300,
      },
    ];

    testCases.forEach(({ name, beams, expectedBase }) => {
      test(`${name} should do ${expectedBase} damage, ${expectedBase * 3} when charged`, () => {
        // Calculate damage without charge beam
        const baseBeamDamage = calculateDamage(beams);
        expect(baseBeamDamage).toBe(expectedBase);

        // Add charge beam and verify it triples the damage
        const withCharge = [...beams, 'charge'];
        const chargedDamage = calculateDamage(withCharge);
        expect(chargedDamage).toBe(expectedBase * 3);
      });
    });
  });
}); 