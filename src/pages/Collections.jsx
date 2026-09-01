import { useState, useEffect } from 'react';
import { useCart } from '../CartContext';
import API from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Air Max Revolution', price: 78500, category: 'sneakers', image: 'Chaussures-22.jpeg' },
  { id: 2, name: 'Classic Comfort', price: 54500, category: 'casual', image: 'Chaussures-22.jpeg' },
  { id: 3, name: 'Ultra Sport Pro', price: 96800, category: 'sport', image: 'Chaussures-22.jpeg' },
  { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg' },
];

export default function Collections() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '' });
  const { addItem, count } = useCart();

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setProducts(FALLBACK_PRODUCTS));
  }, []);

  const filtered = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const addToCart = (product) => {
    addItem(product);
    setToast({ show: true, message: `${product.name} ajoute au panier` });
  };

  return (
    <>
      <Header cartCount={count} />

      <section className="collections-page">
        <div className="container">
          <h1 className="collections-page__title">Nos Collections</h1>
          <p className="collections-page__subtitle">Toutes nos paires, verifiees et pretes a etre cop.</p>

          <div className="products__filters">
            {['all', 'sneakers', 'casual', 'sport'].map(cat => (
              <button
                key={cat}
                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'Tous' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="products__grid">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
    </>
  );
}
