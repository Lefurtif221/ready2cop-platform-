import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const imageUrl = product.image?.startsWith('http')
    ? product.image
    : `/uploads/${product.image}`;

  return (
    <article className="product">
      <div className="product__image" onClick={() => navigate(`/produit/${product.id}`)}>
        <img
          src={imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/Chaussures-22.jpeg';
          }}
        />
        <div className="product__overlay">
          <button className="product__quick-view">Voir</button>
        </div>
      </div>
      <div className="product__info">
        <h3 className="product__name">{product.name}</h3>
        <p className="product__price">{product.price.toLocaleString('fr-FR')} FCFA</p>
        <button
          className="btn btn--add-cart"
          onClick={() => onAddToCart(product)}
        >
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
