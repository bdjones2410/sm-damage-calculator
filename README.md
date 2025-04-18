# Super Metroid Damage Calculator

A web application that helps calculate beam damage against bosses in Super Metroid.

## Features

- Select different beam combinations (Power, Ice, Wave, Plasma, and Charge)
- Choose from various bosses (Kraid, Ridley, Phantoon, Draygon, and Mother Brain)
- Calculate base damage, effective damage, and shots needed to defeat a boss
- Accounts for boss weaknesses and resistances
- Real-time damage calculations

## Setup

1. Make sure you have Node.js installed on your system
2. Clone this repository
3. Navigate to the project directory
4. Install dependencies:
```bash
npm install
```
5. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

1. Select beam combinations using the checkboxes (Power Beam is always active)
2. Choose a boss from the dropdown menu
3. View the calculated damage and number of shots needed to defeat the boss

## Technical Details

- Built with React and Material-UI
- Implements accurate damage calculations based on the game's mechanics
- Includes beam stacking effects and boss-specific damage modifiers
- Features a dark theme inspired by Super Metroid's aesthetic

## Damage Calculation

- Base damage is determined by the highest damage beam in your combination
- Beam modifiers stack multiplicatively
- Boss weaknesses increase damage by 50%
- Boss resistances reduce damage by 25%
- Charge beam multiplies damage by 3x 