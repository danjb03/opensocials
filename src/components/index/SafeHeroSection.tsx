
import React from 'react';

interface SafeHeroSectionProps {
  user: any;
}

export const SafeHeroSection: React.FC<SafeHeroSectionProps> = ({ user }) => {
  try {
    // Try to import the full hero section
    const { HeroSection } = require('./HeroSection');
    return <HeroSection user={user} />;
  } catch (error) {
    console.warn('HeroSection failed, using minimal hero:', error);
    
    // Minimal fallback hero
    return (
      <section style={{
        paddingTop: '128px',
        paddingBottom: '80px',
        padding: '128px 24px 80px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '8px' }}>
            <img 
              src="/lovable-uploads/21ae8cf5-2c99-4851-89c8-71f69414fc49.png" 
              alt="OS Logo" 
              style={{ width: 'auto', height: '288px', margin: '0 auto' }}
            />
          </div>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 8rem)',
            fontWeight: '300',
            marginBottom: '32px',
            letterSpacing: '-0.025em',
            color: '#ffffff'
          }}>
            Creator partnerships,<br />
            <span style={{ color: '#888888' }}>the efficient way</span>
          </h1>
          <p style={{
            fontSize: 'clamp(1.25rem, 2vw, 2rem)',
            color: '#888888',
            marginBottom: '48px',
            maxWidth: '800px',
            margin: '0 auto 48px',
            lineHeight: '1.6'
          }}>
            The fastest way to close creator deals, without cutting any corners.
          </p>
          {!user && (
            <button
              style={{
                padding: '12px 24px',
                border: '1px solid #ffffff',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '16px',
                marginBottom: '24px'
              }}
              onClick={() => window.location.href = '/auth'}
            >
              Register Interest
            </button>
          )}
        </div>
      </section>
    );
  }
};
