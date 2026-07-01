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
        <img 
          src="/logo.svg" 
          alt="ManaCity Logo" 
          style={{ width: '80%', maxWidth: '350px', marginBottom: '1.5rem' }} 
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
          The Smart Business Growth Platform
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
