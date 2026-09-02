import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const root = createRoot(document.getElementById('root'));

window.onerror = function(msg, url, line, col, error) {
  document.body.innerHTML = '<div style="padding:40px;font-family:monospace;background:#111;color:#ff6b00;min-height:100vh"><h1>Erreur detectee</h1><pre style="white-space:pre-wrap;margin-top:20px">' + msg + '\n\n' + (error?.stack || '') + '</pre></div>';
  return false;
};
window.onunhandledrejection = function(e) {
  document.body.innerHTML = '<div style="padding:40px;font-family:monospace;background:#111;color:#ff6b00;min-height:100vh"><h1>Erreur detectee</h1><pre style="white-space:pre-wrap;margin-top:20px">' + (e.reason?.message || e.reason || 'Unknown error') + '\n\n' + (e.reason?.stack || '') + '</pre></div>';
};

root.render(<App />)
