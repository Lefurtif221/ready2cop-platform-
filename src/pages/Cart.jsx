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
            <div style={{display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start'}}>
              <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                {items.map(item => {
                  const itemKey = item.size ? `${item.id}-${item.size}` : `${item.id}`;
                  return (
                    <div key={itemKey} style={{display: 'flex', gap: 20, padding: 20, background: 'var(--white)', border: '1px solid rgba(0,0,0,.06)', borderRadius: 14, alignItems: 'center'}}>
                      <img src={getImageUrl(item.image)} alt={item.name} style={{width: 100, height: 100, objectFit: 'cover', borderRadius: 10, flex: '0 0 auto'}} onError={(e) => { e.target.src = '/Chaussures-22.jpeg'; }} />
                      <div style={{flex: 1}}>
                        <Link to={`/produit/${item.id}`} style={{fontWeight: 600, fontSize: '1rem', color: 'var(--black)'}}>{item.name}</Link>
                        <p style={{color: 'var(--orange)', fontWeight: 700, fontSize: '.95rem', marginTop: 4}}>{item.price.toLocaleString('fr-FR')} FCFA</p>
                        {item.size && <div style={{fontSize: '.8rem', color: 'var(--mid)', marginTop: 2}}>Taille: <b style={{color: 'var(--black)'}}>{item.size}</b></div>}
                        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 10}}>
                          <button onClick={() => updateQty(item.id, item.size, item.qty - 1)} style={{width: 30, height: 30, borderRadius: 8, border: '1.5px solid var(--warm-gray)', background: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--black)'}}>-</button>
                          <span style={{fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.95rem', minWidth: 24, textAlign: 'center'}}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, item.size, item.qty + 1)} style={{width: 30, height: 30, borderRadius: 8, border: '1.5px solid var(--warm-gray)', background: 'var(--white)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--black)'}}>+</button>
                          <button onClick={() => removeItem(item.id, item.size)} style={{font: '500 10px/1 var(--font-display)', letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--mid)', border: 'none', background: 'none', cursor: 'pointer', padding: '6px 10px', marginLeft: 6}}>Supprimer</button>
                        </div>
                      </div>
                      <div style={{fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'var(--black)', whiteSpace: 'nowrap'}}>
                        {(item.price * item.qty).toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{background: 'var(--off-white)', border: '1px solid rgba(0,0,0,.06)', borderRadius: 16, padding: 28, position: 'sticky', top: 120}}>
                <h3 style={{fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 20}}>Resume de la commande</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid rgba(0,0,0,.06)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '.9rem', color: 'var(--mid)'}}>
                    <span>Sous-total ({count} article{count > 1 ? 's' : ''})</span>
                    <span>{total.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '.9rem', color: 'var(--mid)'}}>
                    <span>Livraison</span>
                    <span style={{color: 'var(--green)', fontWeight: 600}}>Gratuite</span>
                  </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 24}}>
                  <span>Total</span>
                  <span style={{color: 'var(--orange)'}}>{total.toLocaleString('fr-FR')} FCFA</span>
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
