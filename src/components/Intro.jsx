import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const SNEAKER_COUNT = 6;
const ORBIT_RADIUS = 180;

export default function Intro({ onComplete }) {
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const logoRef = useRef(null);
  const taglineRef = useRef(null);
  const sneakersRef = useRef([]);
  const glowRef = useRef(null);
  const overlayRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(overlayRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.inOut',
            onComplete: () => {
              setVisible(false);
              onComplete();
            }
          });
        }
      });

      // Initial states
      gsap.set(logoRef.current, { opacity: 0, scale: 0.3 });
      gsap.set(taglineRef.current, { opacity: 0, y: 20 });
      gsap.set(glowRef.current, { opacity: 0, scale: 0.5 });

      sneakersRef.current.forEach((el, i) => {
        if (!el) return;
        const angle = (i / SNEAKER_COUNT) * Math.PI * 2;
        gsap.set(el, {
          opacity: 0,
          x: Math.cos(angle) * 500,
          y: Math.sin(angle) * 500,
          scale: 0.3,
          rotation: gsap.utils.random(-180, 180),
        });
      });

      // Phase 1: Glow
      tl.to(glowRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'power2.out',
      }, 0);

      // Phase 2: Logo
      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(1.7)',
      }, 0.3);

      // Phase 3: Sneakers fly to orbit
      sneakersRef.current.forEach((el, i) => {
        if (!el) return;
        const angle = (i / SNEAKER_COUNT) * Math.PI * 2;
        tl.to(el, {
          opacity: 1,
          x: Math.cos(angle) * ORBIT_RADIUS,
          y: Math.sin(angle) * ORBIT_RADIUS,
          scale: 1,
          rotation: 0,
          duration: 0.9,
          ease: 'power3.out',
        }, 0.2 + i * 0.08);
      });

      // Phase 4: Tagline
      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, 1);

      // Phase 5: Sneakers orbit
      sneakersRef.current.forEach((el, i) => {
        if (!el) return;
        const startAngle = (i / SNEAKER_COUNT) * Math.PI * 2;
        const obj = { angle: startAngle };

        tl.to(obj, {
          angle: startAngle + Math.PI * 2,
          duration: 1.8,
          ease: 'none',
          onUpdate: () => {
            gsap.set(el, {
              x: Math.cos(obj.angle) * ORBIT_RADIUS,
              y: Math.sin(obj.angle) * ORBIT_RADIUS,
            });
          }
        }, 1.2);
      });

      // Phase 6: Exit
      tl.to(logoRef.current, {
        scale: 1.2,
        duration: 0.4,
        ease: 'power2.in',
      }, 3);

      tl.to(sneakersRef.current.filter(Boolean), {
        scale: 1.3,
        opacity: 0.6,
        duration: 0.4,
        ease: 'power2.in',
        stagger: 0.02,
      }, 3);

    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="intro-overlay">
      <div ref={containerRef} className="intro-container">
        {/* Center point — everything orbits around this */}
        <div ref={centerRef} className="intro-center">
          <div ref={glowRef} className="intro-glow" />
          <img ref={logoRef} src="/logo-removebg-preview.png" alt="Ready2Cop" className="intro-logo" />
          <p ref={taglineRef} className="intro-tagline">Sneakers authentiques. Livrees a Dakar.</p>
        </div>

        {/* Sneakers — positioned absolutely, orbit via GSAP x/y */}
        {[...Array(SNEAKER_COUNT)].map((_, i) => (
          <div
            key={i}
            ref={el => sneakersRef.current[i] = el}
            className="intro-sneaker"
          >
            <img src="/Chaussures-22.jpeg" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
