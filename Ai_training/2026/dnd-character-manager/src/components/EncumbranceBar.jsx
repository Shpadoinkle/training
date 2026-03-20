import React from 'react'
import { ENCUMBRANCE_TIERS, getEncumbranceTier } from '../data/encumbrance'

const MAX_DISPLAY = 1600

export default function EncumbranceBar({ totalCn }) {
  const tier = getEncumbranceTier(totalCn)
  const pct = Math.min(100, (totalCn / MAX_DISPLAY) * 100)
  const cannotMove = totalCn > 1600

  return (
    <div className="encumbrance-widget">
      <div className="enc-header">
        <span className="enc-title">Encumbrance</span>
        <span className="enc-weight">{totalCn} cn &nbsp;<span className="enc-lb">({(totalCn / 10).toFixed(1)} lbs)</span></span>
      </div>

      <div className="enc-bar-track">
        {/* Tier zone markers */}
        {[400, 800, 1200, 1600].map(mark => (
          <div
            key={mark}
            className="enc-tick"
            style={{ left: `${(mark / MAX_DISPLAY) * 100}%` }}
          />
        ))}
        <div
          className="enc-bar-fill"
          style={{ width: `${pct}%`, backgroundColor: tier.color }}
        />
      </div>

      <div className="enc-tier-labels">
        <span style={{ left: '0%' }}>0</span>
        <span style={{ left: '25%' }}>400</span>
        <span style={{ left: '50%' }}>800</span>
        <span style={{ left: '75%' }}>1200</span>
        <span style={{ left: '100%' }}>1600+</span>
      </div>

      <div className="enc-status" style={{ borderColor: tier.color, color: tier.color }}>
        <strong>{tier.label}</strong>
        <span>Movement: <strong>{tier.move}</strong> per turn/round</span>
      </div>

      {cannotMove && (
        <div className="enc-warning">
          ⚠ Your character cannot move! Drop {totalCn - 1600} cn of gear.
        </div>
      )}

      <div className="enc-tiers-table">
        {ENCUMBRANCE_TIERS.map(t => (
          <div
            key={t.label}
            className={`enc-tier-row ${tier === t ? 'active' : ''}`}
          >
            <span className="enc-dot" style={{ background: t.color }} />
            <span className="enc-tier-name">{t.label}</span>
            <span className="enc-tier-range">
              {t.max === Infinity ? '1601+ cn' : `≤ ${t.max} cn`}
            </span>
            <span className="enc-tier-move">{t.move}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
