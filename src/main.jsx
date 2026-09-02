import { createRoot } from 'react-dom/client'
import App from './App.jsx'

window.onerror = function(msg, url, line, col, error) {
  document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:monospace"><h2>Erreur detectee</h2><pre>' + msg + '</pre><pre>' + (error?.stack || '') + '</pre></div>';
  return false;
};

window.addEventListener('unhandledrejection', function(e) {
  document.getElementById('root').innerHTML = '<div style="padding:40px;font-family:monospace"><h2>Promise rejectee</h2><pre>' + (e.reason?.message || e.reason || 'unknown') + '</pre><pre>' + (e.reason?.stack || '') + '</pre></div>';
});

createRoot(document.getElementById('root')).render(<App />)
