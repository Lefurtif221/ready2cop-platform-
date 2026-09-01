import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import API from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, count, total, clearCart } = useCart();
  const [toast, setToast] = useState({ show: false, message: '' });
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        items: items.map(i => ({ id: i.id, quantity: i.qty, price: i.price })),
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

  if (count === 0) return (
    <>
      <Header cartCount={count} />
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-empty">
            <i className="fas fa-bag-shopping"></i>
            <p>Ton panier est vide</p>
            <a href="/collections" className="btn btn--primary">Voir les produits</a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header cartCount={count} />

      <section className="checkout-page">
        <div className="container">
          <h1 className="checkout-page__title">Finaliser la commande</h1>

          <div className="checkout-grid">
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h2 className="checkout-form__subtitle">Tes informations</h2>

              <div className="checkout-form__group">
                <label htmlFor="name">Nom complet *</label>
                <input type="text" id="name" name="name" value={form.name} onChange={handleChange} required placeholder="Ex: Mouhamadou" />
              </div>

              <div className="checkout-form__group">
                <label htmlFor="phone">Numero WhatsApp *</label>
                <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="Ex: 77 123 45 67" />
              </div>

              <div className="checkout-form__group">
                <label htmlFor="address">Adresse de livraison *</label>
                <input type="text" id="address" name="address" value={form.address} onChange={handleChange} required placeholder="Ex: Plateau, Dakar" />
              </div>

              <div className="checkout-form__group">
                <label htmlFor="note">Note (optionnel)</label>
                <textarea id="note" name="note" value={form.note} onChange={handleChange} rows="3" placeholder="Taille, couleur, etc." />
              </div>

              <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
                {loading ? 'Envoi en cours...' : <><i className="fas fa-paper-plane"></i> Envoyer la commande</>}
              </button>
            </form>

            <div className="checkout-summary">
              <h2 className="checkout-summary__title">Recapitulatif</h2>
              <div className="checkout-summary__items">
                {items.map(item => (
                  <div key={item.id} className="checkout-summary__item">
                    <img
                      src={item.image?.startsWith('http') ? item.image : `/uploads/${item.image}`}
                      alt={item.name}
                      onError={(e) => { e.target.src = '/Chaussures-22.jpeg'; }}
                    />
                    <div>
                      <p>{item.name}</p>
                      <span>{item.qty} x {item.price.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="checkout-summary__total">
                <span>Total</span>
                <span>{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <p className="checkout-summary__note">
                <i className="fas fa-info-circle"></i> Paiement a la livraison. On te contacte sur WhatsApp pour confirmer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
    </>
  );
}
