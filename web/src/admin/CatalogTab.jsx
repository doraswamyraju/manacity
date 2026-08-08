import React from 'react';
import { Plus, Database, Trash2 } from 'lucide-react';

function CatalogTab({ catalog, newItem, setNewItem, itemMessage, handleCreateCatalogItem, handleDeleteCatalogItem, theme }) {
  const isDark = theme === 'dark';

  const formInputStyle = {
    width: '100%',
    padding: '0.65rem',
    borderRadius: '8px',
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #cbd5e1',
    color: isDark ? '#fff' : '#0f172a',
    fontSize: '0.85rem'
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Creator Form */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} color="#6366f1" /> Create Master Item
        </h3>
        <p style={{ fontSize: '0.85rem', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '1rem' }}>
          Add products or services to the global catalog library so businesses can import them with 1-click.
        </p>

        {itemMessage && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
            ✓ {itemMessage}
          </div>
        )}

        <form onSubmit={handleCreateCatalogItem} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            type="text"
            placeholder="Item Title (e.g. Google Local SEO Package)"
            required
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            style={formInputStyle}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <select
              value={newItem.category}
              onChange={e => setNewItem({ ...newItem, category: e.target.value })}
              style={formInputStyle}
            >
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Hardware/Print">Hardware/Print</option>
              <option value="Creative & Design">Creative & Design</option>
              <option value="Software Add-on">Software Add-on</option>
              <option value="Rice Mill">Rice Mill</option>
              <option value="Clinics & Health">Clinics & Health</option>
            </select>

            <select
              value={newItem.type}
              onChange={e => setNewItem({ ...newItem, type: e.target.value })}
              style={formInputStyle}
            >
              <option value="SERVICE">Service</option>
              <option value="PRODUCT">Product</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Default Price (e.g. ₹1,499)"
            value={newItem.defaultPrice}
            onChange={e => setNewItem({ ...newItem, defaultPrice: e.target.value })}
            style={formInputStyle}
          />

          <textarea
            placeholder="Short description..."
            rows={3}
            value={newItem.description}
            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
            style={formInputStyle}
          />

          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#6366f1', padding: '0.65rem', fontWeight: 700 }}>
            Publish Master Item
          </button>
        </form>
      </div>

      {/* Master Items List */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: isDark ? 'none' : '0 4px 15px rgba(0,0,0,0.03)'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: isDark ? '#f8fafc' : '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} color="#c084fc" /> Master Catalog Library
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
          {catalog.map(catItem => (
            <div key={catItem.id} style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              backgroundColor: isDark ? '#0f172a' : '#f8fafc',
              borderRadius: '10px',
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9'
            }}>
              <div>
                <strong style={{ color: isDark ? '#fff' : '#0f172a', fontSize: '0.9rem', display: 'block' }}>{catItem.name}</strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                  <span style={{ color: isDark ? '#818cf8' : '#4338ca', backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>{catItem.category}</span>
                  <span style={{ color: isDark ? '#cbd5e1' : '#475569', fontWeight: 600 }}>₹{catItem.defaultPrice || '0'}</span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteCatalogItem(catItem.id)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CatalogTab;
