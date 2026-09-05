import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { getImageUrl } from '../utils';
import API from '../api';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, count, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      setToast({ show: true, message: 'Remplis tous les champs obligatoires' });
      return;
    }
    setLoading(true);
    try {
      await API.post('/orders', {
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        customer_note: form.note,
        items: items.map(i => ({ id: i.id, name: i.name, quantity: i.qty, price: i.price, size: i.size || null })),
        total,
      });
      clearCart();
      setToast({ show: true, message: 'Commande envoyee ! On va te contacter bientot.' });
      setTimeout(() => navigate('/'), 2000);
    } catch {
      setToast({ show: true, message: 'Erreur, reessaye ou commande via WhatsApp' });
    }
    setLoading(false);
  };

  // Reveal on scroll
  useEffect(() => {
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (RM) { document.querySelectorAll('.rv').forEach(el => el.classList.add('in')); return; }
    const els = document.querySelectorAll('.rv');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el, i) => { el.style.transitionDelay = `${i * 70}ms`; io.observe(el); });
    return () => io.disconnect();
  }, []);

  const Nav = () => (
    <>
      <div className="ann" aria-hidden="true"><div className="ann__row"><div className="ann__tk"><span>Livraison 24-48h au Sénégal</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div><div className="ann__tk"><span>Livraison 24-48h au Sénégal</span><i>/</i><span>100% authentique</span><i>/</i><span>Paiement a la livraison</span><i>/</i><span>Satisfait ou rembourse</span><i>/</i></div></div></div>
      <nav className="r2c-nav"><div className="r2c-nav__bar"><ul className="r2c-nav__links"><li><Link to="/">Accueil</Link></li><li><Link to="/collections">Collections</Link></li></ul><Link to="/" className="r2c-nav__mk"><img src="/logo-removebg-preview.png" alt="Ready2Cop" style={{height: 44, width: 'auto'}} /></Link><div className="r2c-nav__util"><Link to="/panier">Panier (<b>{count}</b>)</Link></div></div></nav>
    </>
  );

  if (count === 0) return (
    <>
      <Nav />
      <section className="r2c-cart"><div className="r2c-cart__wrap">
        <div className="r2c-cart__empty rv">
          <i className="fas fa-bag-shopping"></i>
          <p>Ton panier est vide</p>
          <Link to="/collections" className="r2c-btn"><span>Voir les produits</span></Link>
        </div>
      </div></section>
    </>
  );

  return (
    <>
      <Nav />

      <section className="r2c-checkout">
        <div className="r2c-checkout__wrap">
          <h1 className="r2c-checkout__title rv">Finaliser la commande</h1>

          <div className="r2c-checkout__grid">
            <form className="r2c-checkout__form rv" onSubmit={handleSubmit}>
              <h2 className="r2c-checkout__form-title">Tes informations</h2>

              <div className="r2c-checkout__field">
                <label htmlFor="name">Nom complet *</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Ex: Mouhamadou" />
              </div>

              <div className="r2c-checkout__field">
                <label htmlFor="phone">Numero WhatsApp *</label>
                <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="Ex: 77 123 45 67" />
              </div>

              <div className="r2c-checkout__field">
                <label htmlFor="address">Adresse de livraison *</label>
                <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required placeholder="Ex: Dakar, Plateau" />
              </div>

              <div className="r2c-checkout__field">
                <label htmlFor="note">Note (optionnel)</label>
                <textarea id="note" name="note" value={form.note} onChange={handleChange} rows="3" placeholder="Ex: Couleur preferée, remarque..." />
              </div>

              <button type="submit" className="r2c-btn" style={{width: '100%', textAlign: 'center'}} disabled={loading}>
                <span>{loading ? 'Envoi en cours...' : 'Envoyer la commande'}</span>
              </button>
            </form>

            <div className="r2c-checkout__summary rv">
              <h3 className="r2c-checkout__summary-title">Recapitulatif</h3>
              <div className="r2c-checkout__summary-items">
                {items.map(item => (
                  <div key={item.id} className="r2c-checkout__summary-item">
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.name}
                      onError={(e) => { e.target.src = '/Chaussures-22.jpeg'; }}
                    />
                    <div>
                      <p>{item.name}{item.size ? <span className="r2c-checkout__size"> — T{item.size}</span> : null}</p>
                      <span>{item.qty} x {item.price.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="r2c-checkout__summary-total">
                <span>Total</span>
                <span>{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <p className="r2c-checkout__summary-note">
                <i className="fas fa-info-circle"></i> Paiement a la livraison. On te contacte sur WhatsApp pour confirmer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`} onClick={() => setToast({ show: false, message: '' })}>
        <i className="fas fa-check-circle"></i> {toast.message}
      </div>

      {/* Footer */}
      <footer className="r2c-footer">
        <div className="r2c-footer__cols">
          <div><div className="r2c-footer__mk">READY2COP</div><address>Dakar, Sénégal<br/><br/><a href="https://wa.me/221769960000">WhatsApp: +221 76 996 00 00</a></address></div>
          <div><h4>Boutique</h4><Link to="/collections">Sneakers</Link><Link to="/collections">Casual</Link><Link to="/collections">Sport</Link></div>
          <div><h4>Aide</h4><a href="#">Livraison</a><a href="#">Retours</a><a href="#">FAQ</a></div>
          <div><h4>Suivez-nous</h4><a href="#">Instagram</a><a href="#">TikTok</a></div>
        </div>
        <div className="r2c-footer__legal"><span>&copy; 2026 Ready2Cop</span><span>Paiement a la livraison</span></div>
      </footer>
    </>
  );
}
