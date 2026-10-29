import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Layers,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lock,
  Unlock,
  Eye,
  RotateCcw,
  Tag,
  Save,
  X
} from 'lucide-react';

export default function WebsiteBlocksTab({ theme = 'dark' }) {
  const isDark = theme === 'dark';

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [editingBlock, setEditingBlock] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const categories = [
    { key: 'ALL', label: 'All Categories' },
    { key: 'HEADER', label: 'Headers' },
    { key: 'HERO', label: 'Hero Banners' },
    { key: 'ABOUT', label: 'About Us' },
    { key: 'SERVICES', label: 'Services Grid' },
    { key: 'PRODUCTS', label: 'Products Catalog' },
    { key: 'FEATURES', label: 'Why Choose Us' },
    { key: 'TESTIMONIALS', label: 'Reviews & Social Proof' },
    { key: 'CTA', label: 'Call To Action' },
    { key: 'FOOTER', label: 'Footers' }
  ];

  // Seed baseline templates from project_3999 if DB collection is empty
  const defaultSeeds = [
    { category: 'HEADER', name: 'Header 1: Modern Sticky with Announcement Bar', blockKey: 'header-1', isPremium: false, previewImgUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80', description: 'Includes top info strip (Phone & Email), animated services dropdown and mobile drawer' },
    { category: 'HEADER', name: 'Header 2: Clean Minimal Center Navigation', blockKey: 'header-2', isPremium: false, previewImgUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80', description: 'Balanced center brand logo with transparent glass background on scroll' },
    { category: 'HEADER', name: 'Header 3: Direct Call & WhatsApp Action Header', blockKey: 'header-3', isPremium: true, previewImgUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80', description: 'Optimized for local Indian services with prominent high-converting WhatsApp trigger' },
    { category: 'HEADER', name: 'Header 4: Full Multi-Category Megamenu', blockKey: 'header-4', isPremium: true, previewImgUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80', description: 'Megamenu dropdown showcasing top master catalog services with icons' },
    { category: 'HERO', name: 'Hero 1: High-Impact Banner with Floating Trust Badges', blockKey: 'hero-1', isPremium: false, previewImgUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80', description: 'Split layout with headline, bullet points, CTA button and live floating review rating card' },
    { category: 'HERO', name: 'Hero 2: Modern Glassmorphism with Direct Quote Form', blockKey: 'hero-2', isPremium: true, previewImgUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80', description: 'Embedded 1-click lead capture form directly above the fold for maximum conversions' },
    { category: 'HERO', name: 'Hero 3: Video & Scenic Background Collage', blockKey: 'hero-3', isPremium: true, previewImgUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80', description: 'Atmospheric hero with dark gradient overlay and animated pulse badge' }
  ];

  useEffect(() => {
    fetchBlocks();
  }, [selectedCategory]);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/admin/website-blocks?category=${selectedCategory}`);
      if (res.data?.blocks && res.data.blocks.length > 0) {
        setBlocks(res.data.blocks);
      } else {
        setBlocks(defaultSeeds);
      }
    } catch (err) {
      console.warn('Error fetching blocks, using defaults:', err.message);
      setBlocks(defaultSeeds);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePremium = async (block) => {
    const newPremium = !block.isPremium;
    try {
      await axios.post('/api/admin/website-blocks', {
        ...block,
        isPremium: newPremium
      });
      setBlocks(prev => prev.map(b => b.blockKey === block.blockKey ? { ...b, isPremium: newPremium } : b));
      setFeedback({ type: 'success', text: `Updated "${block.name}" to ${newPremium ? 'PREMIUM (Paid Add-on)' : 'FREE (Standard)'}.` });
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to update premium status.' });
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSaveBlock = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/website-blocks', editingBlock);
      setFeedback({ type: 'success', text: `Successfully saved block "${editingBlock.name}"!` });
      setEditingBlock(null);
      fetchBlocks();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Failed to save block.' });
    } finally {
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const handleDeleteBlock = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the active block library?`)) return;
    try {
      await axios.delete(`/api/admin/website-blocks/${id}`);
      setFeedback({ type: 'success', text: `Deleted "${name}" from block library.` });
      fetchBlocks();
    } catch (err) {
      setFeedback({ type: 'error', text: 'Failed to delete block.' });
    } finally {
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Top Banner */}
      <div style={{
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '10px', backgroundColor: '#6366f1', color: '#fff', display: 'flex' }}>
              <Layers size={20} />
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', margin: 0 }}>
              Dynamic Website Blocks & Layouts Library
            </h2>
          </div>
          <p style={{ fontSize: '0.88rem', color: isDark ? '#94a3b8' : '#64748b', margin: '0.35rem 0 0' }}>
            Manage headers, hero layouts, and section blocks. When you add or toggle a layout here, it updates in real time in all business builder portals.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditingBlock({
            category: 'HEADER',
            name: '',
            blockKey: `block-${Date.now()}`,
            previewImgUrl: '',
            description: '',
            isPremium: false,
            status: 'ACTIVE'
          })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#6366f1',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.65rem 1.25rem',
            fontSize: '0.86rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
          }}
        >
          <Plus size={16} /> Add New Block / Layout
        </button>
      </div>

      {feedback && (
        <div style={{
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.86rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: feedback.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: feedback.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${feedback.type === 'success' ? '#10b981' : '#ef4444'}`
        }}>
          {feedback.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {feedback.text}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {categories.map((cat) => (
          <button
            key={cat.key}
            type="button"
            onClick={() => setSelectedCategory(cat.key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '24px',
              border: 'none',
              backgroundColor: selectedCategory === cat.key ? '#6366f1' : (isDark ? '#1e293b' : '#f1f5f9'),
              color: selectedCategory === cat.key ? '#ffffff' : (isDark ? '#94a3b8' : '#475569'),
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Block Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>Loading block library...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
          {blocks.map((block) => (
            <div
              key={block.id || block.blockKey}
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                {/* Thumbnail Preview Banner */}
                <div style={{ height: '160px', position: 'relative', backgroundColor: isDark ? '#0f172a' : '#f1f5f9', overflow: 'hidden' }}>
                  <img
                    src={block.previewImgUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'}
                    alt={block.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80'; }}
                  />

                  {/* Category Pill */}
                  <div style={{
                    position: 'absolute',
                    top: '0.75rem',
                    left: '0.75rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '8px',
                    letterSpacing: '0.04em'
                  }}>
                    {block.category}
                  </div>

                  {/* Premium Lock Badge */}
                  <button
                    type="button"
                    onClick={() => handleTogglePremium(block)}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: block.isPremium ? '#ef4444' : '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0.25rem 0.65rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                    }}
                    title="Click to toggle between Free and Premium Add-on"
                  >
                    {block.isPremium ? <Lock size={12} /> : <Unlock size={12} />}
                    {block.isPremium ? 'PRO (PAID)' : 'FREE TIER'}
                  </button>
                </div>

                {/* Details */}
                <div style={{ padding: '1.15rem' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: '0 0 0.4rem' }}>
                    {block.name}
                  </h4>
                  <div style={{ fontSize: '0.74rem', color: '#6366f1', fontWeight: 700, marginBottom: '0.5rem', fontFamily: 'monospace' }}>
                    Key: {block.blockKey}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: isDark ? '#94a3b8' : '#64748b', margin: 0, lineHeight: 1.45 }}>
                    {block.description || 'Verified responsive template block.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ padding: '0.85rem 1.15rem', borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`, display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingBlock(block)}
                  style={{
                    flex: 1,
                    backgroundColor: isDark ? '#334155' : '#f1f5f9',
                    color: isDark ? '#f8fafc' : '#334155',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Edit2 size={13} /> Edit Layout
                </button>

                {block.id && (
                  <button
                    type="button"
                    onClick={() => handleDeleteBlock(block.id, block.name)}
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.45rem 0.75rem',
                      cursor: 'pointer'
                    }}
                    title="Delete Block"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Block Modal */}
      {editingBlock && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '1.75rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: isDark ? '#ffffff' : '#0f172a', margin: 0 }}>
                {editingBlock.id ? 'Edit Template Block' : 'Register New Layout Block'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingBlock(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBlock} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Block Category *
                </label>
                <select
                  value={editingBlock.category}
                  onChange={e => setEditingBlock({ ...editingBlock, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                    outline: 'none'
                  }}
                >
                  <option value="HEADER">HEADER (Header Navigation)</option>
                  <option value="HERO">HERO (Hero Landing Banner)</option>
                  <option value="ABOUT">ABOUT (About Us Section)</option>
                  <option value="SERVICES">SERVICES (Services Grid)</option>
                  <option value="PRODUCTS">PRODUCTS (Products Catalog)</option>
                  <option value="FEATURES">FEATURES (Why Choose Us)</option>
                  <option value="TESTIMONIALS">TESTIMONIALS (Reviews)</option>
                  <option value="CTA">CTA (Call To Action)</option>
                  <option value="FOOTER">FOOTER (Website Footer)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Block Display Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Header 5: Minimal Centered Logo"
                  value={editingBlock.name}
                  onChange={e => setEditingBlock({ ...editingBlock, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Unique Block Identifier Key *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. header-5, hero-banner-split"
                  value={editingBlock.blockKey}
                  onChange={e => setEditingBlock({ ...editingBlock, blockKey: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                    outline: 'none',
                    fontFamily: 'monospace',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Preview Thumbnail Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingBlock.previewImgUrl || ''}
                  onChange={e => setEditingBlock({ ...editingBlock, previewImgUrl: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', display: 'block', marginBottom: '0.35rem' }}>
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of what this layout includes..."
                  value={editingBlock.description || ''}
                  onChange={e => setEditingBlock({ ...editingBlock, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                    color: isDark ? '#ffffff' : '#0f172a',
                    border: `1px solid ${isDark ? '#334155' : '#cbd5e1'}`,
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="modal-is-premium"
                  checked={editingBlock.isPremium}
                  onChange={e => setEditingBlock({ ...editingBlock, isPremium: e.target.checked })}
                  style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                />
                <label htmlFor="modal-is-premium" style={{ fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#f8fafc' : '#0f172a', cursor: 'pointer' }}>
                  Require Paid Smart Builder Add-On (Locked for Free Users)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setEditingBlock(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: `1px solid ${isDark ? '#475569' : '#cbd5e1'}`,
                    color: isDark ? '#cbd5e1' : '#475569',
                    borderRadius: '8px',
                    padding: '0.6rem 1.15rem',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#6366f1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.6rem 1.4rem',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Save to Platform Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
