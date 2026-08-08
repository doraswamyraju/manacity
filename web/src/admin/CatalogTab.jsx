import React from 'react';
import { Plus, Database, Trash2 } from 'lucide-react';

function CatalogTab({ catalog, newItem, setNewItem, itemMessage, handleCreateCatalogItem, handleDeleteCatalogItem }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Creator Form */}
      <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} color="#6366f1" /> Create Master Item
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1rem' }}>
          Add products or services to the global catalog library so businesses can import them with 1-click.
        </p>

        {itemMessage && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem' }}>
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

          <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#6366f1', padding: '0.6rem' }}>
            Publish Master Item
          </button>
        </form>
      </div>

      {/* Master Items List */}
      <div className="glass-card" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Database size={18} color="#a855f7" /> Master Catalog Library
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '420px', overflowY: 'auto' }}>
          {catalog.map(catItem => (
            <div key={catItem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div>
                <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{catItem.name}</strong>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                  <span style={{ color: '#818cf8', backgroundColor: 'rgba(99,102,241,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{catItem.category}</span>
                  <span style={{ color: '#cbd5e1' }}>₹{catItem.defaultPrice || '0'}</span>
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

const formInputStyle = {
  width: '100%',
  padding: '0.6rem',
  borderRadius: '6px',
  backgroundColor: '#0f172a',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '0.85rem'
};

export default CatalogTab;
