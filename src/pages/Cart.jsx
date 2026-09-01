import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Cart() {
  const { items, count, total, removeItem } = useCart();

  return (
    <>
      <Header cartCount={count} />

      <section className="cart-page">
        <div className="container">
          <h1 className="cart-page__title">Mon panier</h1>

          {count === 0 ? (
            <div className="cart-page__empty">
              <i className="fas fa-bag-shopping"></i>
              <p>Ton panier est vide</p>
              <a href="/collections" className="btn btn--primary">Voir les produits</a>
            </div>
          ) : (
            <>
              <div className="cart-page__items">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <img
                      src={item.image?.startsWith('http') ? item.image : `/uploads/${item.image}`}
                      alt={item.name}
                      className="cart-item__img"
                      onError={(e) => { e.target.src = '/Chaussures-22.jpeg'; }}
                    />
                    <div className="cart-item__info">
                      <h3 className="cart-item__name">{item.name}</h3>
                      <p className="cart-item__price">{item.price.toLocaleString('fr-FR')} FCFA</p>
                      <div className="cart-item__qty">
                        <button onClick={() => removeItem(item.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                        <span>{item.qty}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-page__summary">
                <div className="cart-page__total">
                  <span>Total</span>
                  <span>{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <Link to="/checkout" className="btn btn--primary btn--lg btn--full">
                  <i className="fas fa-credit-card"></i> Commander
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
