import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Grid,
} from '@mui/material';
import { beams, calculateDamage } from './data/beams';
import { bosses, calculateEffectiveDamage } from './data/bosses';
import { ammoTypes, calculateAmmoDamage } from './data/ammo';

function App() {
  const [selectedBeams, setSelectedBeams] = useState(['power']);
  const [ammoQuantities, setAmmoQuantities] = useState({
    missile: 0,
    superMissile: 0,
  });
  const [isRidleyDoubleDamage, setIsRidleyDoubleDamage] = useState(true);
  const [isMotherBrainDoubleDamage, setIsMotherBrainDoubleDamage] = useState(true);

  const handleBeamToggle = (beamKey) => {
    if (beamKey === 'power') return; // Power beam can't be toggled
    
    setSelectedBeams(prev => {
      // If trying to select Spazer while Plasma is selected, or vice versa
      if ((beamKey === 'spazer' && prev.includes('plasma')) || 
          (beamKey === 'plasma' && prev.includes('spazer'))) {
        return prev; // Don't change selection
      }

      if (prev.includes(beamKey)) {
        return prev.filter(b => b !== beamKey);
      } else {
        return [...prev, beamKey];
      }
    });
  };

  const handleAmmoChange = (ammoType, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    setAmmoQuantities(prev => ({
      ...prev,
      [ammoType]: quantity
    }));
  };

  const baseDamage = calculateDamage(selectedBeams);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Super Metroid Damage Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left side - Base Damage Values and Minimum Requirements */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Base Damage Values
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Beams
            </Typography>
            {Object.entries(beams).map(([key, beam]) => (
              <Typography key={key} variant="body1">
                {beam.name}: {beam.baseDamage || 'N/A'}
              </Typography>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Ammo
            </Typography>
            {Object.entries(ammoTypes).map(([key, ammo]) => (
              <Typography key={key} variant="body1">
                {ammo.name}: {ammo.damage}
              </Typography>
            ))}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Minimum Requirements
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Zebetites
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              each zeb:
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              • 2 + 3 or 5 + 2
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Minimum ammo:
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              • 8 + 12
            </Typography>
            <Typography variant="body2" sx={{ ml: 2, mb: 2 }}>
              • 20 + 8
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              MB Tank
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Minimum ammo:
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              • 14 + 4
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              • 18 + 3
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              Total Required:
            </Typography>
            <Typography variant="body2" sx={{ ml: 2 }}>
              • 35 + 15 ~
            </Typography>
          </Paper>
        </Grid>

        {/* Right side - Calculator */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h5" gutterBottom>
                  Select Beam Combinations
                </Typography>
                <FormGroup>
                  {Object.entries(beams).map(([key, beam]) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={selectedBeams.includes(key)}
                          onChange={() => handleBeamToggle(key)}
                          disabled={
                            key === 'power' || 
                            ((key === 'spazer' && selectedBeams.includes('plasma')) || 
                             (key === 'plasma' && selectedBeams.includes('spazer')))
                          }
                        />
                      }
                      label={beam.name}
                    />
                  ))}
                </FormGroup>
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Base Beam Damage
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {baseDamage}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  per shot
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Ammo Selection
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(ammoTypes).map(([key, ammo]) => (
                <Grid item xs={12} sm={6} key={key}>
                  <TextField
                    fullWidth
                    label={ammo.name + 's'}
                    type="number"
                    value={ammoQuantities[key]}
                    onChange={(e) => handleAmmoChange(key, e.target.value)}
                    inputProps={{ min: 0 }}
                    helperText={`${ammo.damage} damage per ${ammo.name}`}
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Boss Damage Calculations
            </Typography>
            <Grid container spacing={2}>
              {Object.entries(bosses)
                .sort(([keyA], [keyB]) => {
                  // Sort Ridley and Mother Brain first
                  if (keyA === 'ridley') return -1;
                  if (keyB === 'ridley') return 1;
                  if (keyA === 'motherBrain') return -1;
                  if (keyB === 'motherBrain') return 1;
                  return 0;
                })
                .map(([key, boss]) => {
                  const effectiveDamage = calculateEffectiveDamage(
                    baseDamage,
                    boss,
                    selectedBeams
                  );
                  const totalAmmoDamage = Object.entries(ammoQuantities).reduce((total, [ammoType, quantity]) => {
                    return total + calculateAmmoDamage(ammoType, quantity, key, isRidleyDoubleDamage, isMotherBrainDoubleDamage);
                  }, 0);
                  const remainingHealth = Math.max(0, boss.health - totalAmmoDamage);
                  const shotsToKill = remainingHealth > 0 ? Math.ceil(remainingHealth / effectiveDamage) : 0;

                  return (
                    <Grid item xs={12} sm={6} key={key}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          {boss.name}
                        </Typography>
                        <Typography variant="body2">
                          Health: {boss.health}
                        </Typography>
                        <Typography variant="body2">
                          Base Damage: {baseDamage}
                        </Typography>
                        <Typography variant="body2">
                          Total Ammo Damage: {totalAmmoDamage}
                        </Typography>
                        <Typography variant="body2">
                          Remaining Health: {remainingHealth}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mt: 1 }}>
                          Shots to Kill: {!selectedBeams.includes('charge') && shotsToKill > 0 ? (
                            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                              charge required
                            </Typography>
                          ) : shotsToKill}
                        </Typography>
                        {(key === 'ridley' || key === 'motherBrain') && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={key === 'ridley' ? isRidleyDoubleDamage : isMotherBrainDoubleDamage}
                                onChange={(e) => 
                                  key === 'ridley' 
                                    ? setIsRidleyDoubleDamage(e.target.checked)
                                    : setIsMotherBrainDoubleDamage(e.target.checked)
                                }
                              />
                            }
                            label="Super Missiles do double damage"
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Paper>
                    </Grid>
                  );
                })}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;