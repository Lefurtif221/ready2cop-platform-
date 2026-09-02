import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import API from '../api';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Air Max Revolution', price: 78500, category: 'sneakers', image: 'Chaussures-22.jpeg' },
  { id: 2, name: 'Classic Comfort', price: 54500, category: 'casual', image: 'Chaussures-22.jpeg' },
  { id: 3, name: 'Ultra Sport Pro', price: 96800, category: 'sport', image: 'Chaussures-22.jpeg' },
  { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [addedId, setAddedId] = useState(null);
  const { addItem, count } = useCart();
  const heroRef = useRef(null);
  const revealRefs = useRef([]);
  const wordRef = useRef(null);
  const modelRef = useRef(null);

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
    if (RM) {
      document.querySelectorAll('.rv').forEach(el => el.classList.add('in'));
      document.querySelectorAll('.hv').forEach(el => el.classList.add('on'));
      return;
    }
    const els = document.querySelectorAll('.rv');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 70}ms`;
      io.observe(el);
    });
    return () => io.disconnect();
  }, [filtered]);

  // Hero load sequence
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) return;
    const order = ['h1', 'hm', 'h2', 'h3'];
    order.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) setTimeout(() => el.classList.add('on'), 120 + i * 140);
    });
  }, []);

  // Parallax on scroll
  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    if (y > window.innerHeight * 1.2) return;
    const model = document.getElementById('hm');
    const back = document.getElementById('wb');
    if (model) model.style.transform = `translateY(${y * -0.06}px) scale(${1 + y * 0.00006})`;
    if (back) back.style.transform = `translateY(${y * 0.14}px)`;
  }, []);

  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) return;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { handleScroll(); ticking = false; }); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [handleScroll]);

  const catMap = { sneakers: 'Sneakers', casual: 'Casual', sport: 'Sport' };

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
            <li><a href="#cats">Sneakers</a></li>
            <li><a href="#cats">Casual</a></li>
            <li><a href="#cats">Sport</a></li>
            <li><a href="#shop">Collection</a></li>
          </ul>
          <Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link>
          <div className="r2c-nav__util">
            <a href="https://wa.me/221771234567" target="_blank" rel="noopener"><i className="fab fa-whatsapp"></i> WhatsApp</a>
            <Link to="/panier">Panier (<b>{count}</b>)</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header id="hero" className="r2c-hero">
        <div className="r2c-hero__wrap">
          <div className="r2c-hero__tl hv" id="h1">
            <p>Sneakers<br/>authentiques<br/>a Dakar.</p>
            <div className="r2c-hero__rule"></div>
          </div>
          <div className="r2c-hero__stage">
            <div className="r2c-hero__word" id="wb" aria-hidden="true">READY2COP</div>
            <img ref={modelRef} id="hm" className="r2c-hero__model hv" src="/Chaussures-22.jpeg" alt="Sneakers Ready2Cop" />
          </div>
          <div className="r2c-hero__br hv" id="h2">
            <p>Collection<br/>Dakar<br/>2026</p>
          </div>
          <div className="r2c-hero__acts hv" id="h3">
            <a href="#shop" className="r2c-btn"><span>Voir les sneakers</span></a>
            <a href="https://wa.me/221771234567" className="r2c-btn-line" target="_blank" rel="noopener">Nous ecrire</a>
          </div>
        </div>
      </header>

      {/* Categories */}
      <section id="cats" className="r2c-cats">
        <div className="r2c-cats__row">
          <a href="#shop" className="r2c-cats__item rv">
            <div className="r2c-cats__ph"><img src="/Chaussures-22.jpeg" alt="Sneakers" loading="lazy" /></div>
            <div>
              <h3>Sneakers</h3>
              <p>Paires iconiques, edition limitee.</p>
              <span className="r2c-cats__go">Voir les sneakers <i>&rarr;</i></span>
            </div>
          </a>
          <a href="#shop" className="r2c-cats__item rv">
            <div className="r2c-cats__ph"><img src="/Chaussures-22.jpeg" alt="Casual" loading="lazy" /></div>
            <div>
              <h3>Casual</h3>
              <p>Confort au quotidien, style assure.</p>
              <span className="r2c-cats__go">Voir casual <i>&rarr;</i></span>
            </div>
          </a>
          <a href="#shop" className="r2c-cats__item rv">
            <div className="r2c-cats__ph"><img src="/Chaussures-22.jpeg" alt="Sport" loading="lazy" /></div>
            <div>
              <h3>Sport</h3>
              <p>Performance et design.</p>
              <span className="r2c-cats__go">Voir sport <i>&rarr;</i></span>
            </div>
          </a>
        </div>
      </section>

      {/* Season */}
      <section id="season" className="r2c-season">
        <div className="r2c-season__grid">
          <div className="r2c-season__copy">
            <div className="r2c-lbl rv" style={{marginBottom: 16}}>Nouveau drop</div>
            <h2 className="rv">Nouvelles<br/>paires.</h2>
            <p className="rv">Chaque mois, de nouvelles references verifiees arrivent. Pas de contrefacon, pas de mauvaise surprise.</p>
            <a href="#shop" className="r2c-btn rv"><span>Decouvrir</span></a>
          </div>
          <div className="r2c-season__shot">
            <img src="/Chaussures-22.jpeg" alt="Sneakers Ready2Cop" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Service */}
      <section id="svc" className="r2c-svc">
        <div className="r2c-svc__row">
          <div className="rv"><h4><i className="fas fa-truck-fast"></i> Livraison 24-48h</h4><p>Livraison rapide a Dakar.</p></div>
          <div className="rv"><h4><i className="fas fa-certificate"></i> 100% authentique</h4><p>Paires verifiees, pas de contrefacon.</p></div>
          <div className="rv"><h4><i className="fas fa-money-bill-wave"></i> Paiement livraison</h4><p>Paye quand tu recois.</p></div>
          <div className="rv"><h4><i className="fas fa-shield-halved"></i> Satisfait ou rembourse</h4><p>Garantie satisfait.</p></div>
        </div>
      </section>

      {/* Shop */}
      <section id="shop" className="r2c-shop">
        <div className="r2c-shop__wrap">
          <div className="r2c-shop__hd">
            <h2 className="rv">Nos best-sellers</h2>
            <div className="r2c-shop__filters rv">
              {['all', 'sneakers', 'casual', 'sport'].map(cat => (
                <button key={cat} className={`r2c-filter ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
                  {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
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

      {/* About */}
      <section id="about" className="r2c-about">
        <div className="r2c-about__grid">
          <div className="r2c-about__copy">
            <div className="r2c-lbl rv" style={{marginBottom: 16}}>A propos</div>
            <h2 className="rv">On vend des<br/>vraies paires.<br/>Point.</h2>
            <p className="rv">Ready2Cop, c'est ne pas avoir a stresser quand tu commandes des sneakers en ligne. Pas de contrefacon, pas de delais interminables.</p>
            <dl className="rv">
              <div><dt>Base a Dakar</dt><dd>On connait le marche</dd></div>
              <div><dt>Livraison 24h</dt><dd>Rapide et fiable</dd></div>
              <div><dt>Paiement flexible</dt><dd>A la livraison</dd></div>
            </dl>
          </div>
          <div className="r2c-about__shot rv">
            <img src="/Chaussures-22.jpeg" alt="Ready2Cop Dakar" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Stats / Dakar */}
      <section id="dakar" className="r2c-dakar">
        <div className="r2c-dakar__grid">
          <figure className="r2c-dakar__shot rv">
            <img src="/Chaussures-22.jpeg" alt="Sneakers Ready2Cop" loading="lazy" />
          </figure>
          <div className="r2c-dakar__copy">
            <div className="r2c-lbl rv" style={{marginBottom: 16}}>Notre expertise</div>
            <h2 className="rv">Dakar,<br/>notre terrain.</h2>
            <p className="rv">On connait le marche senegalais. On sait ce que les gens veulent, et on sait ce qu'ils ne veulent pas : des mauvaises surprises.</p>
            <div className="r2c-dakar__count rv">
              <div><b data-to="500">0</b><span>Paires vendues</span></div>
              <div><b data-to="50">0</b><span>Modeles dispo</span></div>
              <div><b data-to="24">0</b><span>Heures livraison</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section id="wa" className="r2c-wa">
        <h2 className="rv">Une question ?</h2>
        <p className="rv">Ecris-nous sur WhatsApp, on repond en quelques minutes.</p>
        <a href="https://wa.me/221771234567" className="r2c-btn-wa rv" target="_blank" rel="noopener">
          <i className="fab fa-whatsapp"></i> Ouvrir WhatsApp
        </a>
      </section>

      {/* Footer */}
      <footer className="r2c-footer">
        <div className="r2c-footer__cols">
          <div>
            <div className="r2c-footer__mk">READY2COP</div>
            <address>Dakar, Senegal<br/><br/><a href="https://wa.me/221771234567">WhatsApp: +221 77 123 45 67</a></address>
          </div>
          <div><h4>Boutique</h4><a href="#cats">Sneakers</a><a href="#cats">Casual</a><a href="#cats">Sport</a><a href="#shop">Tout voir</a></div>
          <div><h4>Aide</h4><a href="#">Livraison</a><a href="#">Retours</a><a href="#">Tailles</a><a href="#">FAQ</a></div>
          <div><h4>Suivez-nous</h4><a href="#">Instagram</a><a href="#">TikTok</a><a href="#">Facebook</a></div>
        </div>
        <div className="r2c-footer__legal">
          <span>&copy; 2026 Ready2Cop Dakar</span>
          <span>Paiement a la livraison</span>
        </div>
      </footer>
    </>
  );
}
