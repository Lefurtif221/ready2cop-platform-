import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { getImageUrl } from '../utils';
import API from '../api';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Air Max Revolution', price: 78500, category: 'sneakers', image: 'Chaussures-22.jpeg', sizes: [{size:40,stock:4},{size:41,stock:5},{size:42,stock:4},{size:43,stock:3}] },
  { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg', sizes: [{size:39,stock:2},{size:40,stock:3},{size:41,stock:4},{size:42,stock:5}] },
];

export default function Collections() {
  const [products, setProducts] = useState([]);
  const { count } = useCart();

  useEffect(() => {
    API.get('/products')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const sneakers = data.filter(p => p.category === 'sneakers');
        setProducts(sneakers.length ? sneakers : FALLBACK_PRODUCTS);
      })
      .catch(() => setProducts(FALLBACK_PRODUCTS));
  }, []);

  return (
    <>
      <div className="ann" aria-hidden="true">
        <div className="ann__row">
          <div className="ann__tk">
            <span>Livraison 24-48h au Sénégal</span><i>/</i>
            <span>100% authentique</span><i>/</i>
            <span>Paiement a la livraison</span><i>/</i>
            <span>Satisfait ou rembourse</span><i>/</i>
          </div>
          <div className="ann__tk">
            <span>Livraison 24-48h au Sénégal</span><i>/</i>
            <span>100% authentique</span><i>/</i>
            <span>Paiement a la livraison</span><i>/</i>
            <span>Satisfait ou rembourse</span><i>/</i>
          </div>
        </div>
      </div>

      <nav className="r2c-nav">
        <div className="r2c-nav__bar">
          <ul className="r2c-nav__links">
            <li><Link to="/">Accueil</Link></li>
            <li><Link to="/collections">Collections</Link></li>
          </ul>
          <Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link>
          <div className="r2c-nav__util">
            <a href="https://wa.me/221769960000" target="_blank" rel="noopener"><i className="fab fa-whatsapp"></i> WhatsApp</a>
            <Link to="/panier">Panier (<b>{count}</b>)</Link>
          </div>
        </div>
      </nav>

      <section className="r2c-collections">
        <div className="r2c-collections__wrap">
          <div className="r2c-collections__hd">
            <h1>Nos Sneakers</h1>
            <p>Toutes nos paires sneakers, verifiees et pretes a etre cop.</p>
          </div>

          <div className="r2c-shop__grid">
            {products.map((product) => {
              const allSizes = product.sizes || [];
              const totalStock = allSizes.reduce((sum, s) => sum + s.stock, 0);
              const lowStock = totalStock > 0 && totalStock <= 3;
              const outOfStock = totalStock === 0;
              return (
                <article key={product.id} className={`r2c-card ${outOfStock ? 'r2c-card--oos' : ''}`}>
                  <div className="r2c-card__ph">
                    {outOfStock && <div className="r2c-card__oos-badge">Rupture</div>}
                    {lowStock && !outOfStock && <div className="r2c-card__low-badge">Dernières paires</div>}
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/Chaussures-22.jpeg'; }}
                      style={outOfStock ? {filter: 'grayscale(1) opacity(.5)'} : {}}
                    />
                    <div className="r2c-card__btns">
                      <Link to={`/produit/${product.id}`} className="r2c-card__view" style={{flex:1}}>{outOfStock ? 'Indisponible' : 'Voir'}</Link>
                    </div>
                  </div>
                  <div className="r2c-card__meta">
                    <div>
                      <Link to={`/produit/${product.id}`} className="r2c-card__nm">{product.name}</Link>
                      <div className="r2c-card__ct">Sneakers</div>
                    </div>
                    <div className="r2c-card__pr">{product.price.toLocaleString('fr-FR')} FCFA</div>
                  </div>
                </article>
              );
            })}
          </div>

          {products.length === 0 && (
            <div style={{textAlign: 'center', padding: '80px 20px'}}>
              <p style={{color: 'var(--mid)'}}>Aucune sneaker disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      <footer className="r2c-footer">
        <div className="r2c-footer__cols">
          <div>
            <div className="r2c-footer__mk">READY2COP</div>
            <address>Dakar, Sénégal<br/><br/><a href="https://wa.me/221769960000">WhatsApp: +221 76 996 00 00</a></address>
          </div>
          <div><h4>Boutique</h4><Link to="/collections">Sneakers</Link></div>
          <div><h4>Aide</h4><a href="#">Livraison</a><a href="#">Retours</a><a href="#">FAQ</a></div>
          <div><h4>Suivez-nous</h4><a href="#">Instagram</a><a href="#">TikTok</a></div>
        </div>
        <div className="r2c-footer__legal">
          <span>&copy; 2026 Ready2Cop</span>
          <span>Paiement a la livraison</span>
        </div>
      </footer>
    </>
  );
}
