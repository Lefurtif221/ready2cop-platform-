import { useState, useEffect } from 'react';

const SNEAKER_COUNT = 6;

export default function Intro({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="intro-overlay">
      <div className="intro-center">
        <div className="intro-glow" />
        <img src="/logo-removebg-preview.png" alt="Ready2Cop" className="intro-logo intro-logo--anim" />
        <p className="intro-tagline intro-tagline--anim">Sneakers authentiques. Livrees a Dakar.</p>
      </div>
      {[...Array(SNEAKER_COUNT)].map((_, i) => (
        <div
          key={i}
          className="intro-sneaker intro-sneaker--anim"
          style={{ animationDelay: `${i * 0.12}s`, '--angle': `${(i / SNEAKER_COUNT) * 360}deg` }}
        >
          <img src="/Chaussures-22.jpeg" alt="" />
        </div>
      ))}
    </div>
  );
}
