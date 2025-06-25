
import React, { useState, useEffect } from "react";
import { MinimalApp } from "./components/MinimalApp";

// EMERGENCY MODE: Ultra-simple app that will always render
function App() {
  const [showMinimal, setShowMinimal] = useState(true);
  const [debugMode, setDebugMode] = useState(true);
  
  console.log('🚀 App component rendering in EMERGENCY MODE...');

  // For now, let's just render the minimal app to confirm React works
  if (showMinimal) {
    return <MinimalApp />;
  }

  // This won't run initially - we're in emergency mode
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#000', 
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <p>Loading...</p>
    </div>
  );
}

export default App;
