import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import Toast from '../components/Toast';

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showToast = (message) => setToast({ show: true, message });
  const closeToast = () => setToast({ show: false, message: '' });

  useEffect(() => {
    loadStats();
    loadProducts();
    loadOrders();
  }, []);

  const loadStats = async () => {
    try {
      const res = await API.get('/orders/stats/overview');
      setStats(res.data);
    } catch {}
  };

  const loadProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch {}
  };

  const loadOrders = async () => {
    try {
      const res = await API.get('/orders');
      setOrders(res.data);
    } catch {}
  };

  const deleteProduct = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
      showToast('Produit supprime');
    } catch {
      showToast('Erreur lors de la suppression');
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}`, { status });
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      loadStats();
      showToast('Statut mis a jour');
    } catch {
      showToast('Erreur');
    }
  };

  const deleteOrder = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return;
    try {
      await API.delete(`/orders/${id}`);
      setOrders(orders.filter(o => o.id !== id));
      loadStats();
      showToast('Commande supprimee');
    } catch {
      showToast('Erreur');
    }
  };

  const statusLabel = (s) => {
    const labels = {
      pending: 'En attente',
      contacted: 'Contacte',
      delivered: 'Livre',
      cancelled: 'Annule'
    };
    return labels[s] || s;
  };

  return (
    <div className="admin">
      <div className="container">
        <div className="admin__header">
          <h1 className="admin__title">Dashboard</h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/" className="btn btn--ghost btn--sm">Voir le site</Link>
            <button className="btn btn--danger btn--sm" onClick={logout}>Deconnexion</button>
          </div>
        </div>

        <div className="admin__tabs">
          <button className={`admin__tab ${tab === 'dashboard' ? 'active' : ''}`} onClick={() => setTab('dashboard')}>Resume</button>
          <button className={`admin__tab ${tab === 'products' ? 'active' : ''}`} onClick={() => setTab('products')}>Produits</button>
          <button className={`admin__tab ${tab === 'orders' ? 'active' : ''}`} onClick={() => setTab('orders')}>Commandes</button>
        </div>

        {tab === 'dashboard' && stats && (
          <>
            <div className="admin__stats">
              <div className="stat-card">
                <div className="stat-card__label">Commandes</div>
                <div className="stat-card__value">{stats.totalOrders}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">Chiffre d'affaires</div>
                <div className="stat-card__value stat-card__value--orange">{stats.totalRevenue.toLocaleString('fr-FR')} FCFA</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">En attente</div>
                <div className="stat-card__value">{stats.pendingOrders}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card__label">Produits</div>
                <div className="stat-card__value">{stats.totalProducts}</div>
              </div>
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 16, fontSize: '1.1rem' }}>Dernieres commandes</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Client</th>
                  <th>Telephone</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_phone}</td>
                    <td style={{ fontWeight: 600 }}>{order.total.toLocaleString('fr-FR')} FCFA</td>
                    <td><span className={`status-badge status-badge--${order.status}`}>{statusLabel(order.status)}</span></td>
                    <td>{new Date(order.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
                {stats.recentOrders.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>Aucune commande pour le moment</td></tr>
                )}
              </tbody>
            </table>
          </>
        )}

        {tab === 'products' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{products.length} produits</h3>
              <button className="btn btn--primary btn--sm" onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>
                + Ajouter un produit
              </button>
            </div>
            {showProductForm && (
              <ProductForm
                product={editingProduct}
                onSave={(p) => {
                  if (editingProduct) {
                    setProducts(products.map(x => x.id === p.id ? p : x));
                  } else {
                    setProducts([p, ...products]);
                  }
                  setShowProductForm(false);
                  setEditingProduct(null);
                  showToast(editingProduct ? 'Produit modifie' : 'Produit ajoute');
                }}
                onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
              />
            )}
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Nom</th>
                  <th>Prix</th>
                  <th>Categorie</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.image?.startsWith('http') ? product.image : `/uploads/${product.image}`}
                        alt={product.name}
                        style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td>{product.price.toLocaleString('fr-FR')} FCFA</td>
                    <td>{product.category}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="btn btn--ghost btn--sm" onClick={() => { setEditingProduct(product); setShowProductForm(true); }}>Modifier</button>
                        <button className="btn btn--danger btn--sm" onClick={() => deleteProduct(product.id)}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'orders' && (
          <>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: 24 }}>{orders.length} commandes</h3>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-card__header">
                    <div>
                      <strong>Commande #{order.id}</strong>
                      <span className={`status-badge status-badge--${order.status}`}>{statusLabel(order.status)}</span>
                    </div>
                    <span className="order-card__date">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>

                  <div className="order-card__customer">
                    <p><i className="fas fa-user"></i> {order.customer_name}</p>
                    <p><i className="fas fa-phone"></i> {order.customer_phone}</p>
                    {order.customer_address && <p><i className="fas fa-location-dot"></i> {order.customer_address}</p>}
                    {order.note && <p><i className="fas fa-comment"></i> {order.note}</p>}
                  </div>

                  <div className="order-card__items">
                    {order.items.map((item, i) => (
                      <span key={i}>{item.quantity || 1}x produit #{item.id}</span>
                    ))}
                  </div>

                  <div className="order-card__footer">
                    <span className="order-card__total">{order.total.toLocaleString('fr-FR')} FCFA</span>
                    <div className="order-card__actions">
                      {order.status === 'pending' && (
                        <button className="btn btn--primary btn--sm" onClick={() => updateOrderStatus(order.id, 'contacted')}>
                          <i className="fas fa-phone"></i> Marquer contacte
                        </button>
                      )}
                      {order.status === 'contacted' && (
                        <button className="btn btn--primary btn--sm" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                          <i className="fas fa-check"></i> Marquer livre
                        </button>
                      )}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <button className="btn btn--danger btn--sm" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                          <i className="fas fa-times"></i> Annuler
                        </button>
                      )}
                      <button className="btn btn--danger btn--sm" onClick={() => deleteOrder(order.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>Aucune commande</p>
              )}
            </div>
          </>
        )}
      </div>
      <Toast message={toast.message} show={toast.show} onClose={closeToast} />
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    category: product?.category || 'sneakers',
    stock: product?.stock || 0,
    description: product?.description || '',
    featured: product?.featured || 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (imageFile) formData.append('image', imageFile);
      let res;
      if (product) {
        res = await API.put(`/products/${product.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        res = await API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSave(res.data);
    } catch {
      alert('Erreur lors de la sauvegarde');
    }
    setLoading(false);
  };

  return (
    <div className="admin-form" style={{ marginBottom: 24 }}>
      <h3 className="admin-form__title">{product ? 'Modifier le produit' : 'Nouveau produit'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label>Prix (FCFA)</label>
            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Categorie</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="sneakers">Sneakers</option>
              <option value="casual">Casual</option>
              <option value="sport">Sport</option>
            </select>
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn--primary btn--sm" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}
