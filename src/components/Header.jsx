import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Header({ cartCount = 0 }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => setMenuOpen(false);
    if (menuOpen) {
      window.addEventListener('resize', close);
      return () => window.removeEventListener('resize', close);
    }
  }, [menuOpen]);

  return (
    <>
      <header className="header">
        <nav className="nav">
          <Link to="/" className="nav__logo">
            <img src="/logo-removebg-preview.png" alt="Ready2Cop" className="nav__logo-img" />
          </Link>
          <ul className="nav__links">
            <li><Link to="/collections">Collections</Link></li>
            <li><a href="/#apropos">A propos</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
          <div className="nav__actions">
            <Link to="/panier" className="nav__cart" aria-label="Panier">
              <i className="fas fa-bag-shopping"></i>
              {cartCount > 0 && <span className="nav__cart-count">{cartCount}</span>}
            </Link>
            <button className="nav__hamburger" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
              <span></span><span></span>
            </button>
          </div>
        </nav>
      </header>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <ul>
          <li><Link to="/collections" onClick={() => setMenuOpen(false)}>Collections</Link></li>
          <li><a href="/#apropos" onClick={() => setMenuOpen(false)}>A propos</a></li>
          <li><a href="/#contact" onClick={() => setMenuOpen(false)}>Contact</a></li>
        </ul>
      </div>
    </>
  );
}
