import React, { useState } from 'react'
import { PRESET_ITEMS, ITEM_CATEGORIES } from '../data/items'

let nextId = 1

export default function Inventory({ items, onChange }) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('All')
  const [customName, setCustomName] = useState('')
  const [customWeight, setCustomWeight] = useState('')
  const [customQty, setCustomQty] = useState(1)
  const [showPresets, setShowPresets] = useState(false)
  const [presetQty, setPresetQty] = useState({})

  function addItem(item, qty = 1) {
    onChange([...items, { ...item, id: nextId++, qty }])
  }

  function removeItem(id) {
    onChange(items.filter(i => i.id !== id))
  }

  function updateQty(id, qty) {
    const n = Math.max(1, Number(qty) || 1)
    onChange(items.map(i => i.id === id ? { ...i, qty: n } : i))
  }

  function addCustom() {
    if (!customName.trim()) return
    const w = Math.max(0, Number(customWeight) || 0)
    addItem({ name: customName.trim(), weight: w, category: 'Custom', cost: '—' }, Number(customQty) || 1)
    setCustomName('')
    setCustomWeight('')
    setCustomQty(1)
  }

  const categories = ['All', ...Object.values(ITEM_CATEGORIES)]
  const filtered = PRESET_ITEMS.filter(item => {
    const matchCat = filterCat === 'All' || item.category === filterCat
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const totalWeight = items.reduce((sum, i) => sum + i.weight * i.qty, 0)

  return (
    <section className="card">
      <h2>Inventory</h2>

      {/* Current inventory list */}
      {items.length === 0 ? (
        <p className="empty-msg">No items carried.</p>
      ) : (
        <table className="inv-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Qty</th>
              <th className="col-right">wt/ea (cn)</th>
              <th className="col-right">Total (cn)</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td><span className="cat-badge">{item.category}</span></td>
                <td>
                  <input
                    className="qty-input"
                    type="number" min="1"
                    value={item.qty}
                    onChange={e => updateQty(item.id, e.target.value)}
                  />
                </td>
                <td className="col-right">{item.weight}</td>
                <td className="col-right weight-total">{item.weight * item.qty}</td>
                <td>
                  <button className="btn-remove" onClick={() => removeItem(item.id)} title="Remove">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td colSpan={4}><strong>Total carried</strong></td>
              <td className="col-right"><strong>{totalWeight} cn</strong></td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      )}

      {/* Add custom item */}
      <div className="add-custom">
        <h3>Add Custom Item</h3>
        <div className="custom-form">
          <input
            placeholder="Item name"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
          />
          <input
            type="number" min="0" placeholder="Weight (cn)"
            value={customWeight}
            onChange={e => setCustomWeight(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustom()}
          />
          <input
            type="number" min="1" placeholder="Qty"
            value={customQty}
            onChange={e => setCustomQty(e.target.value)}
            style={{ width: 60 }}
          />
          <button className="btn-add" onClick={addCustom}>Add</button>
        </div>
      </div>

      {/* Preset items picker */}
      <div className="preset-section">
        <button
          className="btn-toggle"
          onClick={() => setShowPresets(v => !v)}
        >
          {showPresets ? '▲ Hide' : '▼ Show'} Equipment Catalog
        </button>

        {showPresets && (
          <div className="preset-picker">
            <div className="preset-filters">
              <input
                placeholder="Search items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="cat-filters">
                {categories.map(c => (
                  <button
                    key={c}
                    className={`cat-btn ${filterCat === c ? 'active' : ''}`}
                    onClick={() => setFilterCat(c)}
                  >{c}</button>
                ))}
              </div>
            </div>

            <table className="preset-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="col-right">Weight (cn)</th>
                  <th className="col-right">Cost</th>
                  <th>Qty</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td className="col-right">{item.weight}</td>
                    <td className="col-right">{item.cost}</td>
                    <td>
                      <input
                        className="qty-input"
                        type="number" min="1"
                        value={presetQty[item.name] ?? 1}
                        onChange={e => setPresetQty(q => ({ ...q, [item.name]: Number(e.target.value) || 1 }))}
                      />
                    </td>
                    <td>
                      <button
                        className="btn-add-sm"
                        onClick={() => addItem(item, presetQty[item.name] ?? 1)}
                      >+ Add</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
