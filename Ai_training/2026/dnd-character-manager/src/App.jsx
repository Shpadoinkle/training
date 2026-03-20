import React, { useState, useEffect } from 'react'
import CharacterStats from './components/CharacterStats'
import Inventory from './components/Inventory'
import EncumbranceBar from './components/EncumbranceBar'

const DEFAULT_CHARACTER = {
  name: 'Thordak',
  race: 'Human',
  charClass: 'Fighter',
  level: 1,
  xp: 0,
  hp: 8,
  maxHp: 8,
  stats: { STR: 14, DEX: 12, CON: 13, INT: 10, WIS: 9, CHA: 11 },
}

const STORAGE_KEY = 'dnd-character'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch { return null }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export default function App() {
  const saved = loadState()
  const [character, setCharacter] = useState(saved?.character ?? DEFAULT_CHARACTER)
  const [items, setItems] = useState(saved?.items ?? [])

  useEffect(() => {
    saveState({ character, items })
  }, [character, items])

  const totalCn = items.reduce((sum, i) => sum + i.weight * i.qty, 0)

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-title">
          <span className="header-ornament">⚔</span>
          <h1>D&amp;D Basic Set</h1>
          <span className="header-ornament">⚔</span>
        </div>
        <div className="header-subtitle">Character Manager</div>
        <div className="header-divider"><span className="divider-diamond">◆</span></div>
        <div className="rules-note">Moldvay Basic · Cook Expert · B/X Rules</div>
      </header>

      <div className="layout">
        <div className="col-left">
          <CharacterStats character={character} onChange={setCharacter} />
        </div>
        <div className="col-right">
          <EncumbranceBar totalCn={totalCn} />
          <Inventory items={items} onChange={setItems} />
        </div>
      </div>
    </div>
  )
}
