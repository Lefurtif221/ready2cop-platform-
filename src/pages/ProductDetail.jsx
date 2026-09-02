import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { getImageUrl } from '../utils';
import API from '../api';

const catMap = { sneakers: 'Sneakers', casual: 'Casual', sport: 'Sport' };

const FALLBACK_PRODUCT = {
  id: 1, name: 'Air Max Revolution', price: 78500,
  category: 'sneakers', image: 'Chaussures-22.jpeg',
  description: 'Des sneakers authentiques, confortables et styl\u00e9es pour toutes les occasions.'
};

const FALLBACK_SIMILAR = [
  { id: 2, name: 'Classic Comfort', price: 54500, category: 'casual', image: 'Chaussures-22.jpeg' },
  { id: 3, name: 'Ultra Sport Pro', price: 96800, category: 'sport', image: 'Chaussures-22.jpeg' },
  { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg' },
];

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
        setProduct(FALLBACK_PRODUCT);
        setSimilar(FALLBACK_SIMILAR);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  if (loading) return (
    <>
      <div className="ann" aria-hidden="true"><div className="ann__row"><div className="ann__tk"><span>Livraison 24-48h a Dakar</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div><div className="ann__tk"><span>Livraison 24-48h a Dakar</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div></div></div>
      <nav className="r2c-nav"><div className="r2c-nav__bar"><ul className="r2c-nav__links"><li><Link to="/">Accueil</Link></li><li><Link to="/collections">Collections</Link></li></ul><Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link><div className="r2c-nav__util"><Link to="/panier">Panier (<b>{count}</b>)</Link></div></div></nav>
      <div className="product-detail__loading"><div className="spinner"></div></div>
    </>
  );

  if (!product) return null;

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
            <a href="https://wa.me/221771234567" target="_blank" rel="noopener"><i className="fab fa-whatsapp"></i> WhatsApp</a>
            <Link to="/panier">Panier (<b>{count}</b>)</Link>
          </div>
        </div>
      </nav>

      {/* Product Detail - SABLE split layout */}
      <section className="r2c-pdp">
        <div className="r2c-pdp__wrap">
          <button className="r2c-pdp__back" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Retour
          </button>

          <div className="r2c-pdp__split">
            {/* Image - like the season/about split in template */}
            <div className="r2c-pdp__img-wrap">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = '/Chaussures-22.jpeg'; }}
              />
            </div>

            {/* Info - right side with specs */}
            <div className="r2c-pdp__info">
              <span className="r2c-pdp__cat">{catMap[product.category] || product.category}</span>
              <h1 className="r2c-pdp__name">{product.name}</h1>
              <p className="r2c-pdp__price">{product.price.toLocaleString('fr-FR')} FCFA</p>
              <p className="r2c-pdp__desc">
                {product.description || 'Des sneakers authentiques, confortables et styl\u00e9es pour toutes les occasions.'}
              </p>

              {/* Specs - like the dl in about section */}
              <dl className="r2c-pdp__specs">
                <div><dt>Categorie</dt><dd>{catMap[product.category] || product.category}</dd></div>
                <div><dt>Reference</dt><dd>R2C-{String(product.id).padStart(4, '0')}</dd></div>
                <div><dt>Disponibilite</dt><dd>{product.stock > 0 ? 'En stock' : 'Sur commande'}</dd></div>
                <div><dt>Livraison</dt><dd>24-48h a Dakar</dd></div>
              </dl>

              {/* Service meta */}
              <div className="r2c-pdp__meta">
                <div className="r2c-pdp__meta-item"><i className="fas fa-truck-fast"></i><span>Livraison 24-48h a Dakar</span></div>
                <div className="r2c-pdp__meta-item"><i className="fas fa-certificate"></i><span>100% authentique</span></div>
                <div className="r2c-pdp__meta-item"><i className="fas fa-money-bill-wave"></i><span>Paiement a la livraison</span></div>
              </div>

              {/* Actions */}
              <div className="r2c-pdp__actions">
                <button className="r2c-btn" onClick={addToCart}>
                  <span><i className="fas fa-shopping-cart"></i> {added ? 'Ajoute !' : 'Ajouter au panier'}</span>
                </button>
                <a href="https://wa.me/221771234567" className="r2c-btn-line" target="_blank" rel="noopener">
                  <i className="fab fa-whatsapp"></i> Commander via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Similar */}
      {similar.length > 0 && (
        <section className="r2c-similar">
          <div className="r2c-similar__wrap">
            <h2 className="r2c-similar__title">Tu pourrais aussi aimer</h2>
            <div className="r2c-shop__grid">
              {similar.map((p) => (
                <article key={p.id} className="r2c-card">
                  <div className="r2c-card__ph">
                    <img
                      src={getImageUrl(p.image)}
                      alt={p.name}
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/Chaussures-22.jpeg'; }}
                    />
                    <div className="r2c-card__btns">
                      <Link to={`/produit/${p.id}`} className="r2c-card__view">Voir</Link>
                      <button className="r2c-card__add" onClick={() => addItem(p)}>Ajouter</button>
                    </div>
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
          <div><h4>Boutique</h4><Link to="/collections">Sneakers</Link></div>
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
