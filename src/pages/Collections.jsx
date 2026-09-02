import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import API from '../api';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Air Max Revolution', price: 78500, category: 'sneakers', image: 'Chaussures-22.jpeg' },
  { id: 2, name: 'Classic Comfort', price: 54500, category: 'casual', image: 'Chaussures-22.jpeg' },
  { id: 3, name: 'Ultra Sport Pro', price: 96800, category: 'sport', image: 'Chaussures-22.jpeg' },
  { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg' },
];

const catMap = { sneakers: 'Sneakers', casual: 'Casual', sport: 'Sport' };

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [addedId, setAddedId] = useState(null);
  const { addItem, count } = useCart();

  useEffect(() => {
    API.get('/products')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data.length ? data : FALLBACK_PRODUCTS);
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS));
  }, []);

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const addToCart = (product) => {
    addItem(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1300);
  };

  // Reveal on scroll
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) { document.querySelectorAll('.rv').forEach(el => el.classList.add('in')); return; }
    const els = document.querySelectorAll('.rv');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(el); });
    return () => io.disconnect();
  }, [filtered]);

  return (
    <>
      {/* Announcement Bar */}
      <div className="ann" aria-hidden="true">
        <div className="ann__row">
          <div className="ann__tk">
            <span>Livraison 24-48h a Dakar</span><i>/</i>
            <span>100% authentique</span><i>/</i>
            <span>Paiement a la livraison</span><i>/</i>
            <span>Satisfait ou rembourse</span><i>/</i>
          </div>
          <div className="ann__tk">
            <span>Livraison 24-48h a Dakar</span><i>/</i>
            <span>100% authentique</span><i>/</i>
            <span>Paiement a la livraison</span><i>/</i>
            <span>Satisfait ou rembourse</span><i>/</i>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="r2c-nav">
        <div className="r2c-nav__bar">
          <ul className="r2c-nav__links">
            <li><Link to="/">Accueil</Link></li>
            <li><a href="#shop">Collection</a></li>
          </ul>
          <Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link>
          <div className="r2c-nav__util">
            <a href="https://wa.me/221771234567" target="_blank" rel="noopener"><i className="fab fa-whatsapp"></i> WhatsApp</a>
            <Link to="/panier">Panier (<b>{count}</b>)</Link>
          </div>
        </div>
      </nav>

      {/* Collections */}
      <section className="r2c-collections">
        <div className="r2c-collections__wrap">
          <div className="r2c-collections__hd rv">
            <h1>Nos Collections</h1>
            <p>Toutes nos paires, verifiees et pretes a etre cop.</p>
          </div>

          <div className="r2c-shop__filters rv" style={{justifyContent: 'center', marginBottom: 40}}>
            {['all', 'sneakers', 'casual', 'sport'].map(cat => (
              <button key={cat} className={`r2c-filter ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="r2c-shop__grid">
            {filtered.map((product, i) => (
              <article key={product.id} className="r2c-card rv" style={{transitionDelay: `${(i % 4) * 70}ms`}}>
                <div className="r2c-card__ph">
                  <img
                    src={product.image?.startsWith('http') ? product.image : `/uploads/${product.image}`}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => { e.target.onerror = null; e.target.src = '/Chaussures-22.jpeg'; }}
                  />
                  <button className="r2c-card__add" onClick={() => addToCart(product)}>
                    {addedId === product.id ? 'Ajoute !' : 'Ajouter au panier'}
                  </button>
                </div>
                <div className="r2c-card__meta">
                  <div>
                    <Link to={`/produit/${product.id}`} className="r2c-card__nm">{product.name}</Link>
                    <div className="r2c-card__ct">{catMap[product.category] || product.category}</div>
                  </div>
                  <div className="r2c-card__pr">{product.price.toLocaleString('fr-FR')} FCFA</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="r2c-footer">
        <div className="r2c-footer__cols">
          <div>
            <div className="r2c-footer__mk">READY2COP</div>
            <address>Dakar, Senegal<br/><br/><a href="https://wa.me/221771234567">WhatsApp: +221 77 123 45 67</a></address>
          </div>
          <div><h4>Boutique</h4><Link to="/collections">Sneakers</Link><Link to="/collections">Casual</Link><Link to="/collections">Sport</Link></div>
          <div><h4>Aide</h4><a href="#">Livraison</a><a href="#">Retours</a><a href="#">FAQ</a></div>
          <div><h4>Suivez-nous</h4><a href="#">Instagram</a><a href="#">TikTok</a></div>
        </div>
        <div className="r2c-footer__legal">
          <span>&copy; 2026 Ready2Cop Dakar</span>
          <span>Paiement a la livraison</span>
        </div>
      </footer>
    </>
  );
}
