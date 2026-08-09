import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Download, Eye, Edit2, Trash2 } from 'lucide-react';

function ProductsLibraryTab({ catalog = [], theme }) {
  const isDark = theme === 'dark';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0';
  const textMain = isDark ? '#f8fafc' : '#0f172a';
  const textMuted = isDark ? '#94a3b8' : '#64748b';

  const defaultProducts = [
    { id: 'p-1', name: 'NFC Tap & Review Standee', category: 'Hardware/Print', price: '₹799', sku: 'NFC-STD-01', usedIn: 1420, status: 'Active' },
    { id: 'p-2', name: 'Custom QR Window Sticker Pack', category: 'Hardware/Print', price: '₹399', sku: 'QR-STK-05', usedIn: 980, status: 'Active' },
    { id: 'p-3', name: 'Smart Review Counter Device', category: 'Hardware/IoT', price: '₹3,499', sku: 'IOT-CNT-10', usedIn: 412, status: 'Active' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <div style={{ fontSize: '0.8rem', color: textMuted, marginBottom: '0.25rem' }}>
          Library Management &gt; <span style={{ color: isDark ? '#818cf8' : '#4338ca', fontWeight: 600 }}>Products Library</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: textMain, margin: 0 }}>
          Products Library
        </h1>
        <p style={{ fontSize: '0.88rem', color: textMuted, marginTop: '0.25rem' }}>
          Physical & digital products available for business catalog attachment.
        </p>
      </div>

      <div style={{ backgroundColor: cardBg, border: cardBorder, borderRadius: '14px', padding: '1.25rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ color: textMuted, borderBottom: cardBorder, fontSize: '0.78rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem' }}>Product Name</th>
              <th style={{ padding: '0.75rem' }}>SKU</th>
              <th style={{ padding: '0.75rem' }}>Category</th>
              <th style={{ padding: '0.75rem' }}>Default Price</th>
              <th style={{ padding: '0.75rem' }}>Used In</th>
              <th style={{ padding: '0.75rem' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {defaultProducts.map(p => (
              <tr key={p.id} style={{ borderBottom: cardBorder }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: textMain }}>{p.name}</td>
                <td style={{ padding: '0.75rem', color: textMuted }}>{p.sku}</td>
                <td style={{ padding: '0.75rem', color: textMuted }}>{p.category}</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#10b981' }}>{p.price}</td>
                <td style={{ padding: '0.75rem', color: textMuted }}>{p.usedIn}</td>
                <td style={{ padding: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', backgroundColor: 'rgba(16,185,129,0.15)', color: '#10b981' }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductsLibraryTab;
