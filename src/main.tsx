
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeData } from './utils/dataSeed.ts'

// Initialize seed data if localStorage is empty
initializeData();

createRoot(document.getElementById("root")!).render(<App />);
