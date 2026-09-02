import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import API from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Air Max Revolution', price: 78500, category: 'sneakers', image: 'Chaussures-22.jpeg' },
  { id: 2, name: 'Classic Comfort', price: 54500, category: 'casual', image: 'Chaussures-22.jpeg' },
  { id: 3, name: 'Ultra Sport Pro', price: 96800, category: 'sport', image: 'Chaussures-22.jpeg' },
  { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '' });
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
    setToast({ show: true, message: `${product.name} ajoute au panier` });
  };

  return (
    <>
      <Header cartCount={count} />

      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Des sneakers<br /><span className="hero__title--accent">authentiques</span><br />a Dakar.</h1>
          <p className="hero__subtitle">Ready2Cop, c'est des paires verifiees, livrees chez toi en 24h. Pas de contrefacon, pas de mauvaise surprise.</p>
          <div className="hero__cta">
            <Link to="/collections" className="btn btn--primary">Voir les sneakers</Link>
            <a href="https://wa.me/221771234567" className="btn btn--ghost" target="_blank" rel="noopener"><i className="fab fa-whatsapp"></i> Nous ecrire</a>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__shoe-wrap">
            <img src="/Chaussures-22.jpeg" alt="Sneakers Ready2Cop" className="hero__shoe" />
          </div>
        </div>
      </section>

      <section className="trust-bar">
        <div className="trust-bar__item">
          <i className="fas fa-truck-fast"></i>
          <span>Livraison 24-48h</span>
        </div>
        <div className="trust-bar__item">
          <i className="fas fa-certificate"></i>
          <span>100% authentique</span>
        </div>
        <div className="trust-bar__item">
          <i className="fas fa-shield-halved"></i>
          <span>Satisfait ou rembourse</span>
        </div>
        <div className="trust-bar__item">
          <i className="fas fa-money-bill-wave"></i>
          <span>Paiement a la livraison</span>
        </div>
      </section>

      <section className="products" id="collections">
        <div className="container">
          <div className="products__header">
            <h2 className="products__title">Nos best-sellers</h2>
            <Link to="/collections" className="btn btn--outline">Voir tout</Link>
            <div className="products__filters">
              {['all', 'sneakers', 'casual', 'sport'].map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="products__grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <section className="about" id="apropos">
        <div className="container">
          <div className="about__grid">
            <div className="about__text">
              <p className="about__eyebrow">A propos</p>
              <h2 className="about__title">On vend des vraies paires. Point.</h2>
              <p className="about__body">Ready2Cop, c'est ne pas avoir a stresser quand tu commandes des sneakers en ligne. Pas de contrefacon, pas de delais interminables. Tu commandes, tu recois, tu marches. C'est tout.</p>
              <p className="about__body">Base a Dakar, on connait le marche. On sait ce que les gens veulent, et on sait ce qu'ils ne veulent pas : des mauvaises surprises.</p>
            </div>
            <div className="about__visual">
              <img src="/Chaussures-22.jpeg" alt="Ready2Cop Dakar" className="about__image" />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <h2 className="cta-band__title">Une question ? Un taille specifique ?</h2>
          <p className="cta-band__text">Ecris-nous sur WhatsApp, on repond en quelques minutes.</p>
          <a href="https://wa.me/221771234567" className="btn btn--primary btn--lg" target="_blank" rel="noopener"><i className="fab fa-whatsapp"></i> Ouvrir WhatsApp</a>
        </div>
      </section>

      <Footer />
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
    </>
  );
}
