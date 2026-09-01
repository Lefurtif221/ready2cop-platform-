import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import API from '../api';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, count } = useCart();
  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    setLoading(true);
    API.get(`/products/${id}`)
      .then(res => {
        setProduct(res.data);
        return API.get('/products');
      })
      .then(res => {
        const all = res.data;
        const current = all.find(p => p.id === Number(id));
        const sims = all.filter(p => p.id !== Number(id) && p.category === current?.category);
        setSimilar(sims.length ? sims : all.filter(p => p.id !== Number(id)).slice(0, 4));
        setLoading(false);
      })
      .catch(() => {
        setProduct({
          id: 1, name: 'Air Max Revolution', price: 78500,
          category: 'sneakers', image: 'Chaussures-22.jpeg',
          description: 'Des sneakers authentiques, confortables et stylées pour toutes les occasions.'
        });
        setSimilar([
          { id: 2, name: 'Classic Comfort', price: 54500, category: 'casual', image: 'Chaussures-22.jpeg' },
          { id: 3, name: 'Ultra Sport Pro', price: 96800, category: 'sport', image: 'Chaussures-22.jpeg' },
          { id: 4, name: 'Street Style Elite', price: 72600, category: 'sneakers', image: 'Chaussures-22.jpeg' },
        ]);
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    addItem(product);
    setToast({ show: true, message: `${product.name} ajoute au panier` });
  };

  if (loading) return (
    <>
      <Header cartCount={count} />
      <div className="product-detail__loading">
        <div className="spinner"></div>
      </div>
      <Footer />
    </>
  );

  if (!product) return null;

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `/uploads/${product.image}`;

  return (
    <>
      <Header cartCount={count} />

      <section className="product-detail">
        <div className="container">
          <button className="product-detail__back" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Retour
          </button>

          <div className="product-detail__grid">
            <div className="product-detail__image">
              <img
                src={imageUrl}
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Chaussures-22.jpeg';
                }}
              />
            </div>

            <div className="product-detail__info">
              <span className="product-detail__category">{product.category}</span>
              <h1 className="product-detail__name">{product.name}</h1>
              <p className="product-detail__price">{product.price.toLocaleString('fr-FR')} FCFA</p>
              <p className="product-detail__desc">
                {product.description || 'Des sneakers authentiques, confortables et stylées pour toutes les occasions.'}
              </p>

              <div className="product-detail__meta">
                <div className="product-detail__meta-item">
                  <i className="fas fa-truck-fast"></i>
                  <span>Livraison 24-48h a Dakar</span>
                </div>
                <div className="product-detail__meta-item">
                  <i className="fas fa-certificate"></i>
                  <span>100% authentique</span>
                </div>
                <div className="product-detail__meta-item">
                  <i className="fas fa-money-bill-wave"></i>
                  <span>Paiement a la livraison</span>
                </div>
              </div>

              <button className="btn btn--primary btn--lg btn--full" onClick={addToCart}>
                <i className="fas fa-shopping-cart"></i> Ajouter au panier
              </button>

              <a
                href="https://wa.me/221771234567"
                className="btn btn--ghost btn--full"
                target="_blank"
                rel="noopener"
              >
                <i className="fab fa-whatsapp"></i> Commander via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="similar-products">
          <div className="container">
            <h2 className="similar-products__title">Tu pourrais aussi aimer</h2>
            <div className="products__grid">
              {similar.map(p => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={(prod) => {
                    addItem(prod);
                    setToast({ show: true, message: `${prod.name} ajoute au panier` });
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
    </>
  );
}
