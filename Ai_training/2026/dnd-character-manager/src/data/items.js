// Common D&D Basic Set equipment with weights in coins (cn)
// Source: Moldvay Basic / Cook Expert rules

export const ITEM_CATEGORIES = {
  WEAPONS: 'Weapons',
  ARMOR: 'Armor & Shields',
  ADVENTURING: 'Adventuring Gear',
  COINS: 'Coins',
}

export const PRESET_ITEMS = [
  // Weapons
  { name: 'Battle Axe',        weight: 50,  category: ITEM_CATEGORIES.WEAPONS,     cost: '7 gp' },
  { name: 'Club',              weight: 50,  category: ITEM_CATEGORIES.WEAPONS,     cost: '3 gp' },
  { name: 'Dagger',            weight: 10,  category: ITEM_CATEGORIES.WEAPONS,     cost: '3 gp' },
  { name: 'Hand Axe',          weight: 30,  category: ITEM_CATEGORIES.WEAPONS,     cost: '4 gp' },
  { name: 'Mace',              weight: 30,  category: ITEM_CATEGORIES.WEAPONS,     cost: '5 gp' },
  { name: 'Pole Arm',          weight: 150, category: ITEM_CATEGORIES.WEAPONS,     cost: '7 gp' },
  { name: 'Short Bow',         weight: 30,  category: ITEM_CATEGORIES.WEAPONS,     cost: '25 gp' },
  { name: 'Long Bow',          weight: 30,  category: ITEM_CATEGORIES.WEAPONS,     cost: '40 gp' },
  { name: 'Arrows (20)',       weight: 10,  category: ITEM_CATEGORIES.WEAPONS,     cost: '5 gp' },
  { name: 'Crossbow',          weight: 50,  category: ITEM_CATEGORIES.WEAPONS,     cost: '30 gp' },
  { name: 'Crossbow Bolts (30)',weight: 30, category: ITEM_CATEGORIES.WEAPONS,     cost: '10 gp' },
  { name: 'Spear',             weight: 30,  category: ITEM_CATEGORIES.WEAPONS,     cost: '3 gp' },
  { name: 'Sword (normal)',    weight: 60,  category: ITEM_CATEGORIES.WEAPONS,     cost: '10 gp' },
  { name: 'Two-Handed Sword',  weight: 150, category: ITEM_CATEGORIES.WEAPONS,     cost: '15 gp' },
  { name: 'War Hammer',        weight: 30,  category: ITEM_CATEGORIES.WEAPONS,     cost: '5 gp' },
  { name: 'Sling',             weight: 0,   category: ITEM_CATEGORIES.WEAPONS,     cost: '2 gp' },
  { name: 'Sling Stones (30)', weight: 30,  category: ITEM_CATEGORIES.WEAPONS,     cost: '0 gp' },
  { name: 'Staff',             weight: 40,  category: ITEM_CATEGORIES.WEAPONS,     cost: '2 gp' },
  // Armor
  { name: 'Leather Armor',     weight: 200, category: ITEM_CATEGORIES.ARMOR,       cost: '20 gp' },
  { name: 'Chain Mail',        weight: 400, category: ITEM_CATEGORIES.ARMOR,       cost: '40 gp' },
  { name: 'Plate Mail',        weight: 500, category: ITEM_CATEGORIES.ARMOR,       cost: '60 gp' },
  { name: 'Shield',            weight: 100, category: ITEM_CATEGORIES.ARMOR,       cost: '10 gp' },
  // Adventuring gear
  { name: 'Backpack',          weight: 10,  category: ITEM_CATEGORIES.ADVENTURING, cost: '5 gp' },
  { name: 'Flask of Oil',      weight: 10,  category: ITEM_CATEGORIES.ADVENTURING, cost: '2 gp' },
  { name: 'Garlic (1 head)',   weight: 0,   category: ITEM_CATEGORIES.ADVENTURING, cost: '5 gp' },
  { name: 'Hammer (small)',    weight: 10,  category: ITEM_CATEGORIES.ADVENTURING, cost: '2 gp' },
  { name: 'Holy Symbol',       weight: 0,   category: ITEM_CATEGORIES.ADVENTURING, cost: '25 gp' },
  { name: 'Holy Water (vial)', weight: 10,  category: ITEM_CATEGORIES.ADVENTURING, cost: '25 gp' },
  { name: 'Iron Spikes (12)',  weight: 60,  category: ITEM_CATEGORIES.ADVENTURING, cost: '1 gp' },
  { name: 'Lantern',           weight: 30,  category: ITEM_CATEGORIES.ADVENTURING, cost: '10 gp' },
  { name: 'Mirror (hand)',     weight: 0,   category: ITEM_CATEGORIES.ADVENTURING, cost: '5 gp' },
  { name: 'Pole (10\')',       weight: 100, category: ITEM_CATEGORIES.ADVENTURING, cost: '1 gp' },
  { name: 'Rations, Iron (1 wk)', weight: 70, category: ITEM_CATEGORIES.ADVENTURING, cost: '15 gp' },
  { name: 'Rations, Standard (1 wk)', weight: 20, category: ITEM_CATEGORIES.ADVENTURING, cost: '5 gp' },
  { name: 'Rope (50\')',       weight: 50,  category: ITEM_CATEGORIES.ADVENTURING, cost: '1 gp' },
  { name: 'Sack (large)',      weight: 20,  category: ITEM_CATEGORIES.ADVENTURING, cost: '2 gp' },
  { name: 'Sack (small)',      weight: 0,   category: ITEM_CATEGORIES.ADVENTURING, cost: '1 gp' },
  { name: 'Stakes & Mallet (3)', weight: 30, category: ITEM_CATEGORIES.ADVENTURING, cost: '3 gp' },
  { name: 'Thief\'s Tools',   weight: 10,  category: ITEM_CATEGORIES.ADVENTURING, cost: '25 gp' },
  { name: 'Torch',             weight: 10,  category: ITEM_CATEGORIES.ADVENTURING, cost: '1 gp' },
  { name: 'Tinder Box',        weight: 10,  category: ITEM_CATEGORIES.ADVENTURING, cost: '3 gp' },
  { name: 'Water/Wine (1 qt)', weight: 20,  category: ITEM_CATEGORIES.ADVENTURING, cost: '1 gp' },
  { name: 'Wolfsbane (bunch)', weight: 0,   category: ITEM_CATEGORIES.ADVENTURING, cost: '10 gp' },
  // Coins (each coin = 1 cn)
  { name: 'Gold Pieces (10)',  weight: 10,  category: ITEM_CATEGORIES.COINS,       cost: '—' },
  { name: 'Silver Pieces (10)', weight: 10, category: ITEM_CATEGORIES.COINS,       cost: '—' },
  { name: 'Copper Pieces (10)', weight: 10, category: ITEM_CATEGORIES.COINS,       cost: '—' },
]
