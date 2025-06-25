
import React from 'react';

interface SafeIndexNavigationProps {
  user: any;
}

export const SafeIndexNavigation: React.FC<SafeIndexNavigationProps> = ({ user }) => {
  try {
    // Try to import the full navigation
    const { IndexNavigation } = require('./IndexNavigation');
    return <IndexNavigation user={user} />;
  } catch (error) {
    console.warn('IndexNavigation failed, using minimal nav:', error);
    
    // Minimal fallback navigation
    return (
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #333333'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img 
            src="/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png" 
            alt="OS Logo" 
            style={{ height: '40px', width: 'auto' }}
          />
          {!user && (
            <button
              style={{
                padding: '8px 16px',
                border: '1px solid #ffffff',
                borderRadius: '4px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                cursor: 'pointer'
              }}
              onClick={() => window.location.href = '/auth'}
            >
              Get Started
            </button>
          )}
        </div>
      </nav>
    );
  }
};
