import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { getImageUrl } from '../utils';

export default function Cart() {
  const { items, count, total, updateQty, removeItem } = useCart();

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
            <Link to="/panier">Panier (<b>{count}</b>)</Link>
          </div>
        </div>
      </nav>

      <section style={{padding: 'clamp(40px,7vh,86px) 0 clamp(48px,8vh,96px)'}}>
        <div style={{maxWidth: 1440, margin: '0 auto', padding: '0 clamp(18px,3.4vw,44px)'}}>
          <h1 style={{fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(26px,3.4vw,44px)', letterSpacing: '-.015em', textTransform: 'uppercase', marginBottom: 'clamp(20px,3.4vh,34px)'}}>Mon panier</h1>

          {count === 0 ? (
            <div style={{textAlign: 'center', padding: '80px 20px'}}>
              <i className="fas fa-bag-shopping" style={{fontSize: '4rem', color: 'var(--mid)', marginBottom: 20, display: 'block'}}></i>
              <p style={{color: 'var(--mid)', marginBottom: 32, fontSize: '1.1rem'}}>Ton panier est vide</p>
              <Link to="/collections" className="r2c-btn"><span>Voir les sneakers</span></Link>
            </div>
          ) : (
            <div className="r2c-cart__grid">
              <div className="r2c-cart__items">
                {items.map(item => {
                  const itemKey = item.size ? `${item.id}-${item.size}` : `${item.id}`;
                  return (
                    <div key={itemKey} className="r2c-cart__item">
                      <img src={getImageUrl(item.image)} alt={item.name} onError={(e) => { e.target.src = '/Chaussures-22.jpeg'; }} />
                      <div className="r2c-cart__item-info">
                        <Link to={`/produit/${item.id}`} className="r2c-cart__item-name">{item.name}</Link>
                        <div className="r2c-cart__item-price">{item.price.toLocaleString('fr-FR')} FCFA</div>
                        {item.size && <div className="r2c-cart__item-size">Taille: <b>{item.size}</b></div>}
                        <div className="r2c-cart__item-qty">
                          <button className="r2c-cart__qty-btn" onClick={() => updateQty(item.id, item.size, item.qty - 1)}>-</button>
                          <span className="r2c-cart__qty-val">{item.qty}</span>
                          <button className="r2c-cart__qty-btn" onClick={() => updateQty(item.id, item.size, item.qty + 1)}>+</button>
                          <button className="r2c-cart__item-del" onClick={() => removeItem(item.id, item.size)}>Supprimer</button>
                        </div>
                      </div>
                      <div className="r2c-cart__item-total">
                        {(item.price * item.qty).toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="r2c-cart__summary">
                <h3>Resume de la commande</h3>
                <div className="r2c-cart__summary-row">
                  <div className="r2c-cart__summary-line">
                    <span>Sous-total ({count} article{count > 1 ? 's' : ''})</span>
                    <span>{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="r2c-cart__summary-line">
                    <span>Livraison</span>
                    <span>Gratuite</span>
                  </div>
                </div>
                <div className="r2c-cart__summary-total">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <Link to="/checkout" className="r2c-btn" style={{width: '100%', textAlign: 'center', display: 'block'}}>
                  <span>Commander</span>
                </Link>
                <p style={{fontSize: '.8rem', color: 'var(--mid)', textAlign: 'center', lineHeight: 1.5, marginTop: 16}}>
                  <i className="fas fa-lock" style={{marginRight: 4, color: 'var(--orange)'}}></i> Paiement a la livraison
                </p>
                <Link to="/collections" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, font: '500 11px/1 var(--font-display)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mid)'}}>
                  <i className="fas fa-arrow-left" style={{fontSize: '.7rem'}}></i> Continuer mes achats
                </Link>
              </div>
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
          <div><h4>Boutique</h4><Link to="/collections">Sneakers</Link><Link to="/collections">Casual</Link><Link to="/collections">Sport</Link></div>
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
