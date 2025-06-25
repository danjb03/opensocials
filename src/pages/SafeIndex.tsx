
import React from "react";
import { SafeIndexNavigation } from "@/components/index/SafeIndexNavigation";
import { SafeHeroSection } from "@/components/index/SafeHeroSection";

interface SafeIndexProps {
  user?: any;
}

const SafeIndex: React.FC<SafeIndexProps> = ({ user = null }) => {
  console.log('🏠 SafeIndex rendering with user:', !!user);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#000000',
      color: '#ffffff'
    }}>
      <SafeIndexNavigation user={user} />
      <SafeHeroSection user={user} />
      
      {/* Add minimal content sections */}
      <section style={{
        padding: '80px 24px',
        textAlign: 'center',
        borderTop: '1px solid #333333'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: '300',
            marginBottom: '24px',
            color: '#ffffff'
          }}>
            Connect with creators
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#888888',
            lineHeight: '1.6'
          }}>
            Join thousands of brands and creators already using our platform to create authentic partnerships.
          </p>
        </div>
      </section>
    </div>
  );
};

export default SafeIndex;
