import React from 'react'

function App() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div className="glass-card" style={{ maxWidth: '600px', width: '100%' }}>
        <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 800 }}>
          ManaCity
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          Your ultimate SaaS platform for business growth, gamified tasks, and automated websites.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Documentation</button>
        </div>
      </div>
    </div>
  )
}

export default App
