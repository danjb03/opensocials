
import React from 'react';

// Ultra-minimal app that WILL render
export const MinimalApp = () => {
  console.log('🏗️ MinimalApp rendering...');
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ marginBottom: '40px' }}>
        <img 
          src="/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png" 
          alt="OS Logo" 
          style={{ height: '120px', width: 'auto' }}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
      
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: '300', 
        marginBottom: '20px',
        letterSpacing: '-0.025em'
      }}>
        OS - Open Socials
      </h1>
      
      <p style={{ 
        fontSize: '1.25rem', 
        color: '#888888',
        marginBottom: '40px',
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Debug Mode: App is loading successfully
      </p>
      
      <div style={{
        padding: '12px 24px',
        border: '1px solid #ffffff',
        borderRadius: '6px',
        color: '#ffffff',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: '16px',
        marginBottom: '20px'
      }}
      onClick={() => {
        console.log('Button clicked - app is working');
        alert('App is rendering correctly!');
      }}
      >
        Test Button
      </div>
      
      <div style={{ fontSize: '14px', color: '#666' }}>
        <p>✅ React is working</p>
        <p>✅ Styling is working</p>
        <p>✅ Event handlers are working</p>
        <p>Current time: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default MinimalApp;
