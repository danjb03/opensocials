
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🏁 Main.tsx executing...');

const root = createRoot(document.getElementById('root')!);

console.log('🏁 Root created, rendering App...');

// Ultra-simple render without any providers for now
root.render(<App />);

console.log('✅ App rendered successfully');
