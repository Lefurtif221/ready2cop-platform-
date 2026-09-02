import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import API from '../api';

const catMap = { sneakers: 'Sneakers', casual: 'Casual', sport: 'Sport' };

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, count } = useCart();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        return API.get('/products');
      })
      .then(res => {
        const all = Array.isArray(res.data) ? res.data : [];
        const current = all.find(p => p.id === Number(id));
        const sims = all.filter(p => p.id !== Number(id) && p.category === current?.category);
        setSimilar(sims.length ? sims : all.filter(p => p.id !== Number(id)).slice(0, 4));
        setLoading(false);
      })
      .catch(() => {
        setProduct({
          id: 1, name: 'Air Max Revolution', price: 78500,
          category: 'sneakers', image: 'Chaussures-22.jpeg',
          description: 'Des sneakers authentiques, confortables et stylées pour toutes les occasions.'
        });
        setSimilar([
          { id: 2, name: 'Classic Comfort', price: 54500, category: 'casual', image: 'Chaussures-22.jpeg' },
          { id: 3, name: 'Ultra Sport Pro', price: 96800, category: 'sport', image: 'Chaussures-22.jpeg' },
          { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg' },
        ]);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
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
    els.forEach((el, i) => { el.style.transitionDelay = `${i * 70}ms`; io.observe(el); });
    return () => io.disconnect();
  }, [similar]);

  if (loading) return (
    <>
      <div className="ann" aria-hidden="true"><div className="ann__row"><div className="ann__tk"><span>Livraison 24-48h a Dakar</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div><div className="ann__tk"><span>Livraison 24-48h a Dakar</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div></div></div>
      <nav className="r2c-nav"><div className="r2c-nav__bar"><ul className="r2c-nav__links"><li><Link to="/">Accueil</Link></li><li><Link to="/collections">Collections</Link></li></ul><Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link><div className="r2c-nav__util"><Link to="/panier">Panier (<b>{count}</b>)</Link></div></div></nav>
      <div className="product-detail__loading"><div className="spinner"></div></div>
    </>
  );

  if (!product) return null;

  const imageUrl = product.image?.startsWith('http') ? product.image : `/uploads/${product.image}`;

  return (
    <>
      {/* Announcement Bar */}
      <div className="ann" aria-hidden="true">
        <div className="ann__row">
          <div className="ann__tk"><span>Livraison 24-48h a Dakar</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div>
          <div className="ann__tk"><span>Livraison 24-48h a Dakar</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div>
        </div>
      </div>

      {/* Nav */}
      <nav className="r2c-nav">
        <div className="r2c-nav__bar">
          <ul className="r2c-nav__links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/collections">Collections</Link></li>
          </ul>
          <Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link>
          <div className="r2c-nav__util">
            <Link to="/panier">Panier (<b>{count}</b>)</Link>
          </div>
        </div>
      </nav>

      {/* Product Detail */}
      <section className="r2c-pdp">
        <div className="r2c-pdp__wrap">
          <button className="r2c-pdp__back" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Retour
          </button>

          <div className="r2c-pdp__grid">
            <div className="r2c-pdp__img rv">
              <img
                src={imageUrl}
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = '/Chaussures-22.jpeg'; }}
              />
            </div>

            <div className="r2c-pdp__info">
              <span className="r2c-pdp__cat rv">{catMap[product.category] || product.category}</span>
              <h1 className="r2c-pdp__name rv">{product.name}</h1>
              <p className="r2c-pdp__price rv">{product.price.toLocaleString('fr-FR')} FCFA</p>
              <p className="r2c-pdp__desc rv">
                {product.description || 'Des sneakers authentiques, confortables et stylées pour toutes les occasions.'}
              </p>

              <div className="r2c-pdp__meta rv">
                <div className="r2c-pdp__meta-item"><i className="fas fa-truck-fast"></i><span>Livraison 24-48h a Dakar</span></div>
                <div className="r2c-pdp__meta-item"><i className="fas fa-certificate"></i><span>100% authentique</span></div>
                <div className="r2c-pdp__meta-item"><i className="fas fa-money-bill-wave"></i><span>Paiement a la livraison</span></div>
              </div>

              <button className="r2c-btn rv" style={{width: '100%', textAlign: 'center', marginBottom: 12}} onClick={addToCart}>
                <span><i className="fas fa-shopping-cart"></i> {added ? 'Ajoute !' : 'Ajouter au panier'}</span>
              </button>

              <a href="https://wa.me/221771234567" className="r2c-btn-line rv" target="_blank" rel="noopener" style={{display: 'block', textAlign: 'center', marginTop: 16}}>
                <i className="fab fa-whatsapp"></i> Commander via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="r2c-similar">
          <div className="r2c-similar__wrap">
            <h2 className="r2c-similar__title rv">Tu pourrais aussi aimer</h2>
            <div className="r2c-shop__grid">
              {similar.map((p, i) => (
                <article key={p.id} className="r2c-card rv" style={{transitionDelay: `${(i % 4) * 70}ms`}}>
                  <div className="r2c-card__ph">
                    <img
                      src={p.image?.startsWith('http') ? p.image : `/uploads/${p.image}`}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/Chaussures-22.jpeg'; }}
                    />
                    <button className="r2c-card__add" onClick={() => { addItem(p); }}>Ajouter au panier</button>
                  </div>
                  <div className="r2c-card__meta">
                    <div>
                      <Link to={`/produit/${p.id}`} className="r2c-card__nm">{p.name}</Link>
                      <div className="r2c-card__ct">{catMap[p.category] || p.category}</div>
                    </div>
                    <div className="r2c-card__pr">{p.price.toLocaleString('fr-FR')} FCFA</div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
