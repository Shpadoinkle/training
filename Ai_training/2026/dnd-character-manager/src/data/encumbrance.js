// B/X D&D Basic Set encumbrance rules
// Weight measured in coins (cn). 10 coins = 1 lb.
// Each actual gold/silver/copper coin weighs 1 cn.

export const ENCUMBRANCE_TIERS = [
  { max: 400,  label: 'Unencumbered',       move: "120'/40'",  color: '#4caf50' },
  { max: 800,  label: 'Lightly Encumbered', move: "90'/30'",   color: '#8bc34a' },
  { max: 1200, label: 'Heavily Encumbered', move: "60'/20'",   color: '#ff9800' },
  { max: 1600, label: 'Severely Encumbered',move: "30'/10'",   color: '#f44336' },
  { max: Infinity, label: 'Cannot Move',    move: '0',         color: '#b71c1c' },
]

export function getEncumbranceTier(totalCn) {
  return ENCUMBRANCE_TIERS.find(t => totalCn <= t.max)
}
