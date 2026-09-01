import { useEffect } from 'react';

export default function Toast({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <i className="fas fa-check-circle"></i>
      <span>{message}</span>
    </div>
  );
}
