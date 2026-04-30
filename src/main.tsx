import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ObfuscationProvider } from './context/ObfuscationContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ObfuscationProvider>
      <App />
    </ObfuscationProvider>
  </StrictMode>,
);
