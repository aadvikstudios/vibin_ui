export const maleHandleList = [
  'FlirtyFox',
  'LoveMagnet',
  'KinkMaster',
  'RomanticRider',
  'CupidArrow',
  'Phoenix',
  'HeartThrob',
  'SoulmateHunter',
  'MachoKing',
  'GentleGiant',
  'DashingDuke',
  'WildWolf',
];

export const femaleHandleList = [
  'GlamGoddess',
  'LoveQueen',
  'CharmingBelle',
  'SweetAngel',
  'CupidCharm',
  'MysticSiren',
  'FairyLover',
  'DivaStar',
  'SassyPrincess',
  'ElegantEmpress',
  'DreamyDoll',
  'Enchantress',
];

// Function to generate a unique handle with a symbol and a random number based on gender
export const generateUserHandle = (gender) => {
  const symbols = ['.', '_', '@']; // Allowed symbols
  const handleList = gender === 'man' ? maleHandleList : femaleHandleList;

  const randomHandle =
    handleList[Math.floor(Math.random() * handleList.length)];
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  const randomNumber = Math.floor(Math.random() * 1000); // 0-999

  const generatedHandle = `${randomHandle}${randomSymbol}${randomNumber}`;
  return {
    username: generatedHandle, // Display name (original capitalization)
    userhandle: generatedHandle.toLowerCase(), // Lowercase for validation
  };
};
