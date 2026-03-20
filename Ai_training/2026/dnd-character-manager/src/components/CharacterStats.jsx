import React from 'react'

const STATS = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

const STAT_MODIFIERS = {
  STR: { label: 'Strength',     affects: 'Melee hit/dmg, open doors' },
  DEX: { label: 'Dexterity',    affects: 'Missile hit, AC, initiative' },
  CON: { label: 'Constitution', affects: 'HP per level' },
  INT: { label: 'Intelligence', affects: 'Languages, spells (MU)' },
  WIS: { label: 'Wisdom',       affects: 'Saves vs magic, spells (Cleric)' },
  CHA: { label: 'Charisma',     affects: 'Reaction, max retainers' },
}

// B/X stat modifier table
function getModifier(score) {
  if (score <= 3)  return { melee: -3, missile: -3, save: -3 }
  if (score <= 5)  return { melee: -2, missile: -2, save: -2 }
  if (score <= 8)  return { melee: -1, missile: -1, save: -1 }
  if (score <= 12) return { melee:  0, missile:  0, save:  0 }
  if (score <= 15) return { melee: +1, missile: +1, save: +1 }
  if (score <= 17) return { melee: +2, missile: +2, save: +2 }
  return           { melee: +3, missile: +3, save: +3 }
}

function ModBadge({ value }) {
  const cls = value > 0 ? 'mod-pos' : value < 0 ? 'mod-neg' : 'mod-zero'
  return <span className={`mod-badge ${cls}`}>{value > 0 ? `+${value}` : value}</span>
}

export default function CharacterStats({ character, onChange }) {
  const { name, race, charClass, level, hp, maxHp, xp, stats } = character

  function handleStatChange(stat, val) {
    const n = Math.min(18, Math.max(3, Number(val) || 3))
    onChange({ ...character, stats: { ...stats, [stat]: n } })
  }

  function handleField(field, val) {
    onChange({ ...character, [field]: val })
  }

  return (
    <section className="card">
      <h2>Character Sheet</h2>

      <div className="char-identity">
        <label>
          <span>Name</span>
          <input value={name} onChange={e => handleField('name', e.target.value)} />
        </label>
        <label>
          <span>Race</span>
          <select value={race} onChange={e => handleField('race', e.target.value)}>
            {['Human','Dwarf','Elf','Halfling'].map(r => <option key={r}>{r}</option>)}
          </select>
        </label>
        <label>
          <span>Class</span>
          <select value={charClass} onChange={e => handleField('charClass', e.target.value)}>
            {['Cleric','Fighter','Magic-User','Thief','Dwarf','Elf','Halfling'].map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <span>Level</span>
          <input type="number" min="1" max="14" value={level}
            onChange={e => handleField('level', Math.max(1, Number(e.target.value)))} />
        </label>
        <label>
          <span>XP</span>
          <input type="number" min="0" value={xp}
            onChange={e => handleField('xp', Math.max(0, Number(e.target.value)))} />
        </label>
        <label>
          <span>HP</span>
          <div className="hp-row">
            <input type="number" min="0" value={hp}
              onChange={e => handleField('hp', Math.max(0, Number(e.target.value)))} />
            <span className="hp-sep">/</span>
            <input type="number" min="1" value={maxHp}
              onChange={e => handleField('maxHp', Math.max(1, Number(e.target.value)))} />
          </div>
        </label>
      </div>

      <div className="stats-grid">
        {STATS.map(stat => {
          const score = stats[stat]
          const mod = getModifier(score)
          const info = STAT_MODIFIERS[stat]
          return (
            <div key={stat} className="stat-block">
              <div className="stat-label">{info.label}</div>
              <div className="stat-abbr">{stat}</div>
              <input
                className="stat-input"
                type="number" min="3" max="18"
                value={score}
                onChange={e => handleStatChange(stat, e.target.value)}
              />
              <div className="stat-mods">
                {stat === 'STR' && <ModBadge value={mod.melee} />}
                {stat === 'DEX' && <ModBadge value={mod.missile} />}
                {stat === 'CON' && <ModBadge value={mod.save} />}
                {stat === 'INT' && <ModBadge value={mod.save} />}
                {stat === 'WIS' && <ModBadge value={mod.save} />}
                {stat === 'CHA' && <ModBadge value={mod.save} />}
              </div>
              <div className="stat-affects">{info.affects}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
