import { useEffect, useRef, useState } from 'react';

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
    let cancelled = false;
    let ctx = null;

    import('gsap').then(({ default: gsap }) => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            gsap.to(overlayRef.current, {
              opacity: 0,
              duration: 0.6,
              ease: 'power2.inOut',
              onComplete: () => {
                if (!cancelled) {
                  setVisible(false);
                  onComplete();
                }
              }
            });
          }
        });

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

        tl.to(glowRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' }, 0);
        tl.to(logoRef.current, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)' }, 0.3);

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

        tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 1);

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

        tl.to(logoRef.current, { scale: 1.2, duration: 0.4, ease: 'power2.in' }, 3);
        tl.to(sneakersRef.current.filter(Boolean), { scale: 1.3, opacity: 0.6, duration: 0.4, ease: 'power2.in', stagger: 0.02 }, 3);

      }, containerRef);
    }).catch(() => {
      if (!cancelled) {
        setVisible(false);
        onComplete();
      }
    });

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div ref={overlayRef} className="intro-overlay">
      <div ref={containerRef} className="intro-container">
        <div ref={centerRef} className="intro-center">
          <div ref={glowRef} className="intro-glow" />
          <img ref={logoRef} src="/logo-removebg-preview.png" alt="Ready2Cop" className="intro-logo" />
          <p ref={taglineRef} className="intro-tagline">Sneakers authentiques. Livrees a Dakar.</p>
        </div>
        {[...Array(SNEAKER_COUNT)].map((_, i) => (
          <div key={i} ref={el => sneakersRef.current[i] = el} className="intro-sneaker">
            <img src="/Chaussures-22.jpeg" alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
