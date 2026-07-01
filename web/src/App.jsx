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
          style={{ width: '90%', maxWidth: '420px', marginBottom: '2rem' }} 
        />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-primary">Get Started</button>
          <button className="btn btn-secondary">Documentation</button>
        </div>
      </div>
    </div>
  )
}

export default App
