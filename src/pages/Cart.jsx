import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { getImageUrl } from '../utils';

export default function Cart() {
  const { items, count, total, removeItem } = useCart();

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
            <li><Link to="/collections">Collections</Link></li>
          </ul>
          <Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link>
          <div className="r2c-nav__util">
            <Link to="/panier">Panier (<b>{count}</b>)</Link>
          </div>
        </div>
      </nav>

      {/* Cart */}
      <section className="r2c-cart">
        <div className="r2c-cart__wrap">
          <h1 className="r2c-cart__title rv">Mon panier</h1>

          {count === 0 ? (
            <div className="r2c-cart__empty rv">
              <i className="fas fa-bag-shopping"></i>
              <p>Ton panier est vide</p>
              <Link to="/collections" className="r2c-btn"><span>Voir les produits</span></Link>
            </div>
          ) : (
            <div className="r2c-cart__grid">
              <div className="r2c-cart__items">
                {items.map((item, i) => (
                  <div key={item.id} className="r2c-cart-item rv" style={{transitionDelay: `${i * 70}ms`}}>
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      className="r2c-cart-item__img"
                      onError={(e) => { e.target.src = '/Chaussures-22.jpeg'; }}
                    />
                    <div className="r2c-cart-item__info">
                      <Link to={`/produit/${item.id}`} className="r2c-cart-item__name">{item.name}</Link>
                      <p className="r2c-cart-item__price">{item.price.toLocaleString('fr-FR')} FCFA</p>
                      <div className="r2c-cart-item__actions">
                        <span className="r2c-cart-item__qty">Qte: {item.qty}</span>
                        <button className="r2c-cart-item__remove" onClick={() => removeItem(item.id)}>
                          <i className="fas fa-trash"></i> Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="r2c-cart-item__total">
                      {(item.price * item.qty).toLocaleString('fr-FR')} FCFA
                    </div>
                  </div>
                ))}
              </div>

              <div className="r2c-cart-summary rv">
                <h3 className="r2c-cart-summary__title">Resume de la commande</h3>
                <div className="r2c-cart-summary__lines">
                  <div className="r2c-cart-summary__line">
                    <span>Sous-total ({count} article{count > 1 ? 's' : ''})</span>
                    <span>{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="r2c-cart-summary__line">
                    <span>Livraison</span>
                    <span className="r2c-cart-summary__free">Gratuite</span>
                  </div>
                </div>
                <div className="r2c-cart-summary__total">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <Link to="/checkout" className="r2c-btn" style={{width: '100%', textAlign: 'center'}}>
                  <span>Commander</span>
                </Link>
                <p className="r2c-cart-summary__note">
                  <i className="fas fa-lock"></i> Paiement a la livraison
                </p>
                <Link to="/collections" className="r2c-cart-summary__continue">
                  <i className="fas fa-arrow-left"></i> Continuer mes achats
                </Link>
              </div>
            </div>
          )}
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
