import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { getImageUrl } from '../utils';
import API from '../api';

const catMap = { sneakers: 'Sneakers', casual: 'Casual', sport: 'Sport', vetements: 'Vêtements', sacs: 'Sacs' };

const SIZE_ORDER = ['XS','S','M','L','XL','XXL','Unique','36','37','38','39','40','41','42','43','44','45','46','47','48'];
const sortSizes = (arr) => [...(arr || [])].sort((a, b) => {
  const ia = SIZE_ORDER.indexOf(String(a.size)), ib = SIZE_ORDER.indexOf(String(b.size));
  if (ia === -1 && ib === -1) return String(a.size).localeCompare(String(b.size));
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
});

const FALLBACK_PRODUCT = {
  id: 1, name: 'T-shirt Essentiel', price: 25000,
  category: 'vetements', image: 'Chaussures-22.jpeg',
  description: 'Des vêtements de qualité, confortables et stylés pour toutes les occasions.',
  sizes: [{size: 'M', stock: 5}, {size: 'L', stock: 4}, {size: 'XL', stock: 3}]
};

const FALLBACK_SIMILAR = [
  { id: 2, name: 'Sacoche Classic', price: 35000, category: 'sacs', image: 'Chaussures-22.jpeg', sizes: [{size: 'Unique', stock: 4}] },
];

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, count, items } = useCart();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSelectedSize(null);
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
    if (product.sizes && product.sizes.length > 0 && !selectedSize) return;
    const sizeObj = sizes.find(s => String(s.size) === String(selectedSize));
    addItem(product, selectedSize, sizeObj?.stock || 0);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  if (loading) return (
    <>
      <div className="ann" aria-hidden="true"><div className="ann__row"><div className="ann__tk"><span>Livraison 24-48h au Sénégal</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div><div className="ann__tk"><span>Livraison 24-48h au Sénégal</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div></div></div>
      <nav className="r2c-nav"><div className="r2c-nav__bar"><ul className="r2c-nav__links"><li><Link to="/">Accueil</Link></li><li><Link to="/collections">Collections</Link></li></ul><Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link><div className="r2c-nav__util"><Link to="/panier">Panier (<b>{count}</b>)</Link></div></div></nav>
      <div className="product-detail__loading"><div className="spinner"></div></div>
    </>
  );

  if (!product) return null;

  const sizes = sortSizes(product.sizes || []);
  const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);

  // Check if already in cart with max stock for selected size
  const cartItem = selectedSize ? items.find(i => i.id === product.id && String(i.size) === String(selectedSize)) : null;
  const sizeObj = selectedSize ? sizes.find(s => String(s.size) === String(selectedSize)) : null;
  const maxReached = cartItem && sizeObj && cartItem.qty >= sizeObj.stock;

  return (
    <>
      <div className="ann" aria-hidden="true">
        <div className="ann__row">
          <div className="ann__tk"><span>Livraison 24-48h au Sénégal</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div>
          <div className="ann__tk"><span>Livraison 24-48h au Sénégal</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div>
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

      <section className="r2c-pdp">
        <div className="r2c-pdp__wrap">
          <button className="r2c-pdp__back" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Retour
          </button>

          <div className="r2c-pdp__split">
            <div className="r2c-pdp__img-wrap">
              <img
                src={getImageUrl(product.image)}
                alt={product.name}
                onError={(e) => { e.target.onerror = null; e.target.src = '/Chaussures-22.jpeg'; }}
              />
            </div>

            <div className="r2c-pdp__info">
              <span className="r2c-pdp__cat">{catMap[product.category] || product.category}</span>
              <h1 className="r2c-pdp__name">{product.name}</h1>
              <p className="r2c-pdp__price">{product.price.toLocaleString('fr-FR')} FCFA</p>
              <p className="r2c-pdp__desc">
                {product.description || 'Des sneakers authentiques, confortables et styl\u00e9es pour toutes les occasions.'}
              </p>

              <dl className="r2c-pdp__specs">
                <div><dt>Categorie</dt><dd>{catMap[product.category] || product.category}</dd></div>
                <div><dt>Reference</dt><dd>R2C-{String(product.id).padStart(4, '0')}</dd></div>
                <div><dt>Stock total</dt><dd>{totalStock} article{totalStock > 1 ? 's' : ''}</dd></div>
                <div><dt>Livraison</dt><dd>24-48h au Sénégal</dd></div>
              </dl>

              {sizes.length > 0 && (
                <div style={{marginBottom: 24}}>
                  <div style={{fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '12px', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 12, color: 'var(--black)'}}>
                    Choisir une option
                  </div>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
                    {sizes.map(s => (
                      <button
                        key={String(s.size)}
                        onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                        disabled={s.stock === 0}
                        style={{
                          minWidth: 52, padding: '0 14px', height: 44, borderRadius: 8, border: String(selectedSize) === String(s.size) ? '2px solid var(--orange)' : '1.5px solid var(--warm-gray)',
                          background: s.stock === 0 ? 'rgba(0,0,0,.04)' : String(selectedSize) === String(s.size) ? 'var(--orange)' : 'var(--white)',
                          color: s.stock === 0 ? 'var(--mid)' : String(selectedSize) === String(s.size) ? 'var(--bone)' : 'var(--black)',
                          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.85rem', cursor: s.stock === 0 ? 'not-allowed' : 'pointer',
                          position: 'relative', transition: 'all .2s'
                        }}
                      >
                        {s.size}
                        {s.stock <= 2 && s.stock > 0 && <span style={{position: 'absolute', top: -6, right: -6, width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', border: '1.5px solid var(--white)'}}></span>}
                      </button>
                    ))}
                  </div>
                  {selectedSize && (
                    <p style={{fontSize: '.8rem', color: 'var(--mid)', marginTop: 8}}>
                      Taille {selectedSize} : <b style={{color: sizes.find(s => String(s.size) === String(selectedSize))?.stock <= 2 ? 'var(--red)' : 'var(--green)'}}>
                        {sizes.find(s => String(s.size) === String(selectedSize))?.stock} en stock
                      </b>
                      {sizes.find(s => String(s.size) === String(selectedSize))?.stock <= 2 && ' - dernier article' + (sizes.find(s => String(s.size) === String(selectedSize))?.stock === 1 ? '' : 's')}
                    </p>
                  )}
                  {!selectedSize && <p style={{fontSize: '.8rem', color: 'var(--mid)', marginTop: 8}}>Selectionne ta taille</p>}
                </div>
              )}

              <div className="r2c-pdp__meta">
                <div className="r2c-pdp__meta-item"><i className="fas fa-truck-fast"></i><span>Livraison 24-48h au Sénégal</span></div>
                <div className="r2c-pdp__meta-item"><i className="fas fa-certificate"></i><span>100% authentique</span></div>
                <div className="r2c-pdp__meta-item"><i className="fas fa-money-bill-wave"></i><span>Paiement a la livraison</span></div>
              </div>

              <div className="r2c-pdp__actions">
                <button
                  className="r2c-btn"
                  onClick={addToCart}
                  disabled={(sizes.length > 0 && !selectedSize) || added || maxReached}
                  style={{opacity: (sizes.length > 0 && !selectedSize) || added || maxReached ? .5 : 1, cursor: (sizes.length > 0 && !selectedSize) || added || maxReached ? 'not-allowed' : 'pointer'}}
                >
                  <span><i className="fas fa-shopping-cart"></i> {maxReached ? 'Stock maximum atteint' : added ? 'Ajoute !' : 'Ajouter au panier'}</span>
                </button>
                <a href="https://wa.me/221769960000" className="r2c-btn-line" target="_blank" rel="noopener">
                  <i className="fab fa-whatsapp"></i> Commander via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

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
