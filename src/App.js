import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  TextField,
  Grid,
} from '@mui/material';
import { beams, calculateDamage } from './data/beams';
import { bosses, calculateEffectiveDamage } from './data/bosses';
import { ammoTypes, calculateAmmoDamage } from './data/ammo';

function App() {
  const [selectedBeams, setSelectedBeams] = useState(['power']);
  const [selectedBoss, setSelectedBoss] = useState('kraid');
  const [ammoQuantities, setAmmoQuantities] = useState({
    missile: 0,
    superMissile: 0,
  });
  const [isRidleyDoubleDamage, setIsRidleyDoubleDamage] = useState(false);
  const [isMotherBrainDoubleDamage, setIsMotherBrainDoubleDamage] = useState(false);

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
  const effectiveDamage = calculateEffectiveDamage(
    baseDamage,
    bosses[selectedBoss],
    selectedBeams
  );

  // Calculate total ammo damage
  const totalAmmoDamage = Object.entries(ammoQuantities).reduce((total, [ammoType, quantity]) => {
    return total + calculateAmmoDamage(ammoType, quantity, selectedBoss, isRidleyDoubleDamage, isMotherBrainDoubleDamage);
  }, 0);

  // Calculate remaining health after ammo damage
  const remainingHealth = Math.max(0, bosses[selectedBoss].health - totalAmmoDamage);
  const shotsToKill = remainingHealth > 0 ? Math.ceil(remainingHealth / effectiveDamage) : 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom>
        Super Metroid Damage Calculator
      </Typography>

      <Grid container spacing={3}>
        {/* Left side - Base Damage Values */}
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
        </Grid>

        {/* Right side - Calculator */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3, mb: 3 }}>
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
                    helperText={`${ammo.damage} damage per ${ammo.name}${
                      key === 'superMissile' && 
                      ((selectedBoss === 'ridley' && isRidleyDoubleDamage) || 
                       (selectedBoss === 'motherBrain' && isMotherBrainDoubleDamage)) ? 
                      ' (2x damage)' : ''
                    }`}
                  />
                </Grid>
              ))}
            </Grid>
            <FormGroup>
              {selectedBoss === 'ridley' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isRidleyDoubleDamage}
                      onChange={(e) => setIsRidleyDoubleDamage(e.target.checked)}
                    />
                  }
                  label="Super Missiles do double damage to Ridley"
                  sx={{ mt: 2 }}
                />
              )}
              {selectedBoss === 'motherBrain' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMotherBrainDoubleDamage}
                      onChange={(e) => setIsMotherBrainDoubleDamage(e.target.checked)}
                    />
                  }
                  label="Super Missiles do double damage to Mother Brain"
                  sx={{ mt: 2 }}
                />
              )}
            </FormGroup>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Select Boss
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Boss</InputLabel>
              <Select
                value={selectedBoss}
                onChange={(e) => setSelectedBoss(e.target.value)}
                label="Boss"
              >
                {Object.entries(bosses).map(([key, boss]) => (
                  <MenuItem key={key} value={key}>
                    {boss.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Damage Calculation
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                Base Beam Damage per Shot: {baseDamage}
              </Typography>
              <Typography variant="body1">
                Total Ammo Damage: {totalAmmoDamage}
              </Typography>
              <Typography variant="body1">
                Boss Health: {bosses[selectedBoss].health}
              </Typography>
              <Typography variant="body1">
                Remaining Health After Ammo: {remainingHealth}
              </Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Additional Beam Shots Required: {shotsToKill}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;