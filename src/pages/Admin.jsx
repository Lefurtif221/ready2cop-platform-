import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { getImageUrl } from '../utils';
import Toast from '../components/Toast';

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [period, setPeriod] = useState('');
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

  useEffect(() => { loadStats(); }, [period]);

  const loadStats = async () => {
    try {
      const q = period ? `?period=${period}` : '';
      const res = await API.get(`/orders/stats/overview${q}`);
      setStats(res.data);
    } catch {}
  };
  const loadProducts = async () => {
    try { const res = await API.get('/products'); setProducts(res.data); } catch {}
  };
  const loadOrders = async () => {
    try { const res = await API.get('/orders'); setOrders(res.data); } catch {}
  };

  const deleteProduct = async (id) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try { await API.delete(`/products/${id}`); setProducts(products.filter(p => p.id !== id)); showToast('Produit supprime'); } catch { showToast('Erreur'); }
  };

  const updateOrderStatus = async (id, status) => {
    try { await API.put(`/orders/${id}`, { status }); setOrders(orders.map(o => o.id === id ? { ...o, status } : o)); loadStats(); loadProducts(); showToast('Statut mis a jour'); } catch { showToast('Erreur'); }
  };

  const deleteOrder = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return;
    try { await API.delete(`/orders/${id}`); setOrders(orders.filter(o => o.id !== id)); loadStats(); showToast('Commande supprimee'); } catch { showToast('Erreur'); }
  };

  const statusLabel = (s) => ({ pending: 'En attente', contacted: 'Contacte', delivered: 'Livre', cancelled: 'Annule' })[s] || s;
  const statusColor = (s) => ({ pending: '#f59e0b', contacted: '#6366f1', delivered: '#22c55e', cancelled: '#ef4444' })[s] || '#888';

  return (
    <div className="adm">
      {/* Sidebar */}
      <aside className="adm__side">
        <div className="adm__side-mk">
          <img src="/logo-removebg-preview.png" alt="R2C" style={{height: 36, width: 'auto', filter: 'brightness(0) invert(1)'}} />
        </div>
        <nav className="adm__side-nav">
          <button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}><i className="fas fa-chart-line"></i> Dashboard</button>
          <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><i className="fas fa-shoe-prints"></i> Produits</button>
          <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}><i className="fas fa-bag-shopping"></i> Commandes</button>
        </nav>
        <div className="adm__side-footer">
          <Link to="/" className="adm__side-link"><i className="fas fa-arrow-left"></i> Retour au site</Link>
          <button className="adm__side-logout" onClick={logout}><i className="fas fa-right-from-bracket"></i> Deconnexion</button>
        </div>
      </aside>

      {/* Main */}
      <main className="adm__main">
        <header className="adm__top">
          <div>
            <h1 className="adm__top-title">{tab === 'dashboard' ? 'Dashboard' : tab === 'products' ? 'Produits' : 'Commandes'}</h1>
            <p className="adm__top-sub">Ready2Cop Admin</p>
          </div>
          <div className="adm__top-right">
            <span className="adm__top-badge"><i className="fas fa-circle" style={{fontSize: 6, color: '#22c55e'}}></i> Admin</span>
          </div>
        </header>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && stats && (
          <div className="adm__content">
            {/* Period filter */}
            <div className="adm__period">
              <label className="adm__period-label"><i className="fas fa-calendar"></i> Periode</label>
              <select className="adm__period-select" value={period} onChange={e => setPeriod(e.target.value)}>
                <option value="">Tout</option>
                {stats.monthlyData && stats.monthlyData.slice().reverse().map(m => (
                  <option key={m.month} value={m.month}>{m.label}</option>
                ))}
              </select>
              {period && <button className="adm__btn adm__btn--ghost adm__btn--sm" onClick={() => setPeriod('')}><i className="fas fa-times"></i> Reset</button>}
            </div>

            <div className="adm__stats">
              <div className="adm__stat">
                <div className="adm__stat-icon" style={{background: 'rgba(232,101,10,.1)', color: 'var(--orange)'}}><i className="fas fa-bag-shopping"></i></div>
                <div><div className="adm__stat-val">{stats.totalOrders}</div><div className="adm__stat-lbl">Commandes</div></div>
              </div>
              <div className="adm__stat">
                <div className="adm__stat-icon" style={{background: 'rgba(34,197,94,.1)', color: '#22c55e'}}><i className="fas fa-coins"></i></div>
                <div><div className="adm__stat-val">{stats.totalRevenue.toLocaleString('fr-FR')} <small>FCFA</small></div><div className="adm__stat-lbl">Chiffre d'affaires</div></div>
              </div>
              <div className="adm__stat">
                <div className="adm__stat-icon" style={{background: 'rgba(245,158,11,.1)', color: '#f59e0b'}}><i className="fas fa-clock"></i></div>
                <div><div className="adm__stat-val">{stats.pendingOrders}</div><div className="adm__stat-lbl">En attente</div></div>
              </div>
              <div className="adm__stat">
                <div className="adm__stat-icon" style={{background: 'rgba(99,102,241,.1)', color: '#6366f1'}}><i className="fas fa-shoe-prints"></i></div>
                <div><div className="adm__stat-val">{stats.totalProducts}</div><div className="adm__stat-lbl">Produits</div></div>
              </div>
            </div>

            {/* Monthly evolution chart */}
            {stats.monthlyData && stats.monthlyData.length > 0 && (
              <div className="adm__card" style={{marginBottom: 16}}>
                <h3 className="adm__card-title"><i className="fas fa-chart-line" style={{color: 'var(--orange)', marginRight: 8}}></i> Evolution mensuelle</h3>
                <div className="adm__monthly">
                  {stats.monthlyData.map((m, i) => {
                    const maxRev = Math.max(...stats.monthlyData.map(x => x.revenue), 1);
                    const pct = (m.revenue / maxRev) * 100;
                    return (
                      <div key={m.month} className="adm__monthly-col">
                        <div className="adm__monthly-val">{m.revenue > 0 ? (m.revenue / 1000).toFixed(0) + 'k' : '-'}</div>
                        <div className="adm__monthly-bar-wrap">
                          <div className="adm__monthly-bar" style={{height: `${Math.max(pct, m.revenue > 0 ? 4 : 0)}%`}}></div>
                        </div>
                        <div className="adm__monthly-label">{m.label.split(' ')[0].slice(0,3)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Charts row */}
            <div className="adm__charts">
              {/* Top products bar chart */}
              <div className="adm__card">
                <h3 className="adm__card-title"><i className="fas fa-chart-bar" style={{color: 'var(--orange)', marginRight: 8}}></i> Produits les plus vendus</h3>
                {stats.topProducts && stats.topProducts.length > 0 ? (
                  <div className="adm__bars">
                    {stats.topProducts.map((p, i) => {
                      const max = stats.topProducts[0].count;
                      const pct = max > 0 ? (p.count / max) * 100 : 0;
                      return (
                        <div key={i} className="adm__bar-row">
                          <div className="adm__bar-name">{p.name}</div>
                          <div className="adm__bar-track">
                            <div className="adm__bar-fill" style={{width: `${pct}%`}}></div>
                          </div>
                          <div className="adm__bar-count">{p.count}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="adm__empty">Aucune vente pour le moment</p>
                )}
              </div>

              {/* Orders by status */}
              <div className="adm__card">
                <h3 className="adm__card-title"><i className="fas fa-chart-pie" style={{color: '#6366f1', marginRight: 8}}></i> Commandes par statut</h3>
                {stats.ordersByStatus && Object.keys(stats.ordersByStatus).length > 0 ? (
                  <div className="adm__status-chart">
                    {['pending', 'contacted', 'delivered', 'cancelled'].map(s => {
                      const count = stats.ordersByStatus[s] || 0;
                      const total = stats.totalOrders || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={s} className="adm__status-row">
                          <div className="adm__status-dot" style={{background: statusColor(s)}}></div>
                          <div className="adm__status-label">{statusLabel(s)}</div>
                          <div className="adm__status-bar-track">
                            <div className="adm__status-bar-fill" style={{width: `${pct}%`, background: statusColor(s)}}></div>
                          </div>
                          <div className="adm__status-count">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="adm__empty">Aucune commande</p>
                )}
              </div>
            </div>

            {/* Recent orders */}
            <div className="adm__card">
              <h3 className="adm__card-title"><i className="fas fa-clock-rotate-left" style={{color: '#f59e0b', marginRight: 8}}></i> Dernieres commandes</h3>
              <div className="adm__table-wrap">
                <table className="adm__table">
                  <thead><tr><th>#</th><th>Client</th><th>Telephone</th><th>Total</th><th>Statut</th><th>Date</th></tr></thead>
                  <tbody>
                    {stats.recentOrders.map(o => (
                      <tr key={o.id}>
                        <td className="adm__td-id">#{o.id}</td>
                        <td className="adm__td-name">{o.customer_name}</td>
                        <td>{o.customer_phone}</td>
                        <td className="adm__td-price">{o.total.toLocaleString('fr-FR')} FCFA</td>
                        <td><span className="adm__badge" style={{background: statusColor(o.status) + '18', color: statusColor(o.status)}}>{statusLabel(o.status)}</span></td>
                        <td className="adm__td-date">{new Date(o.created_at).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                    {stats.recentOrders.length === 0 && <tr><td colSpan={6} className="adm__empty">Aucune commande</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <div className="adm__content">
            <div className="adm__content-header">
              <span className="adm__content-count">{products.length} produit{products.length > 1 ? 's' : ''}</span>
              <button className="adm__btn adm__btn--primary" onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>
                <i className="fas fa-plus"></i> Ajouter
              </button>
            </div>

            {showProductForm && (
              <ProductForm product={editingProduct} onSave={(p) => {
                if (editingProduct) setProducts(products.map(x => x.id === p.id ? p : x));
                else setProducts([p, ...products]);
                setShowProductForm(false); setEditingProduct(null);
                showToast(editingProduct ? 'Produit modifie' : 'Produit ajoute');
              }} onCancel={() => { setShowProductForm(false); setEditingProduct(null); }} />
            )}

            <div className="adm__products-grid">
              {products.map(p => (
                <div key={p.id} className="adm__product-card">
                  <div className="adm__product-img">
                    <img src={getImageUrl(p.image)} alt={p.name} onError={(e) => { e.target.src = '/Chaussures-22.jpeg'; }} />
                    {p.featured ? <span className="adm__product-badge">Featured</span> : null}
                  </div>
                  <div className="adm__product-info">
                    <div className="adm__product-name">{p.name}</div>
                    <div className="adm__product-meta">
                      <span className="adm__product-price">{p.price.toLocaleString('fr-FR')} FCFA</span>
                      <span className="adm__product-cat">{p.category}</span>
                    </div>
                    <div className="adm__product-stock">Stock: <b>{(p.sizes || []).reduce((sum, s) => sum + s.stock, 0)}</b></div>
                    {p.sizes && p.sizes.length > 0 && (
                      <div className="adm__product-sizes">
                        {p.sizes.map(s => <span key={s.size} className="adm__product-sz">{s.size} ({s.stock})</span>)}
                      </div>
                    )}
                    <div className="adm__product-actions">
                      <button className="adm__btn adm__btn--ghost" onClick={() => { setEditingProduct(p); setShowProductForm(true); }}><i className="fas fa-pen"></i></button>
                      <button className="adm__btn adm__btn--danger" onClick={() => deleteProduct(p.id)}><i className="fas fa-trash"></i></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div className="adm__content">
            <div className="adm__content-header">
              <span className="adm__content-count">{orders.length} commande{orders.length > 1 ? 's' : ''}</span>
            </div>
            <div className="adm__orders">
              {orders.map(order => (
                <div key={order.id} className="adm__order">
                  <div className="adm__order-top">
                    <div className="adm__order-id">#{order.id}</div>
                    <span className="adm__badge" style={{background: statusColor(order.status) + '18', color: statusColor(order.status)}}>{statusLabel(order.status)}</span>
                    <div className="adm__order-date">{new Date(order.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div className="adm__order-customer">
                    <div><i className="fas fa-user"></i> {order.customer_name}</div>
                    <div><i className="fas fa-phone"></i> {order.customer_phone}</div>
                    {order.customer_address && <div><i className="fas fa-location-dot"></i> {order.customer_address}</div>}
                    {order.note && <div><i className="fas fa-comment"></i> {order.note}</div>}
                  </div>
                  <div className="adm__order-items">
                    {(order.items || []).map((item, i) => (
                      <span key={i} className="adm__order-item">{item.quantity || item.qty || 1}x {item.name || `#${item.id}`}{item.size ? ` (T${item.size})` : ''}</span>
                    ))}
                  </div>
                  <div className="adm__order-bottom">
                    <div className="adm__order-total">{order.total.toLocaleString('fr-FR')} FCFA</div>
                    <div className="adm__order-actions">
                      {order.status === 'pending' && <button className="adm__btn adm__btn--primary adm__btn--sm" onClick={() => updateOrderStatus(order.id, 'contacted')}><i className="fas fa-phone"></i> Contacte</button>}
                      {order.status === 'contacted' && <button className="adm__btn adm__btn--primary adm__btn--sm" onClick={() => updateOrderStatus(order.id, 'delivered')}><i className="fas fa-check"></i> Livre</button>}
                      {order.status !== 'delivered' && order.status !== 'cancelled' && <button className="adm__btn adm__btn--danger adm__btn--sm" onClick={() => updateOrderStatus(order.id, 'cancelled')}><i className="fas fa-times"></i></button>}
                      {order.status !== 'delivered' && <button className="adm__btn adm__btn--danger adm__btn--sm" onClick={() => deleteOrder(order.id)}><i className="fas fa-trash"></i></button>}
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && <p className="adm__empty">Aucune commande</p>}
            </div>
          </div>
        )}
      </main>
      <Toast message={toast.message} show={toast.show} onClose={closeToast} />
    </div>
  );
}

function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: product?.name || '', price: product?.price || '', category: product?.category || 'sneakers',
    description: product?.description || '', featured: product?.featured || 0,
  });
  const [sizes, setSizes] = useState(product?.sizes || []);
  const [newSize, setNewSize] = useState('');
  const [newStock, setNewStock] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalStock = sizes.reduce((sum, s) => sum + (s.stock || 0), 0);

  const addSize = () => {
    const sz = parseInt(newSize);
    const st = parseInt(newStock) || 0;
    if (!sz || sz < 30 || sz > 50) return;
    if (sizes.find(s => s.size === sz)) { setNewSize(''); setNewStock(''); return; }
    setSizes([...sizes, { size: sz, stock: st }].sort((a, b) => a.size - b.size));
    setNewSize(''); setNewStock('');
  };

  const updateSizeStock = (size, stock) => {
    setSizes(sizes.map(s => s.size === size ? { ...s, stock: Math.max(0, parseInt(stock) || 0) } : s));
  };

  const removeSize = (size) => {
    setSizes(sizes.filter(s => s.size !== size));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('stock', totalStock);
      fd.append('sizes', JSON.stringify(sizes));
      if (imageFile) fd.append('image', imageFile);
      const res = product
        ? await API.put(`/products/${product.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await API.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onSave(res.data);
    } catch { alert('Erreur lors de la sauvegarde'); }
    setLoading(false);
  };

  return (
    <div className="adm__form">
      <h3 className="adm__form-title">{product ? 'Modifier le produit' : 'Nouveau produit'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="adm__form-grid">
          <div className="adm__field"><label>Nom</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className="adm__field"><label>Prix (FCFA)</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required /></div>
          <div className="adm__field"><label>Categorie</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="sneakers">Sneakers</option><option value="casual">Casual</option><option value="sport">Sport</option>
            </select>
          </div>
          <div className="adm__field"><label>Featured</label>
            <select value={form.featured} onChange={e => setForm({...form, featured: parseInt(e.target.value)})}>
              <option value={0}>Non</option><option value={1}>Oui</option>
            </select>
          </div>
        </div>
        <div className="adm__field"><label>Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
        <div className="adm__field"><label>Image</label><input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} /></div>

        {/* Sizes manager */}
        <div className="adm__sizes-section">
          <div className="adm__sizes-header">
            <label>Tailles & Stock</label>
            <span className="adm__sizes-total">Stock total: <b>{totalStock}</b></span>
          </div>

          {sizes.length > 0 && (
            <div className="adm__sizes-list">
              {sizes.map(s => (
                <div key={s.size} className="adm__size-row">
                  <span className="adm__size-label">Taille {s.size}</span>
                  <div className="adm__size-stock-controls">
                    <button type="button" className="adm__size-btn" onClick={() => updateSizeStock(s.size, s.stock - 1)}>-</button>
                    <input type="number" className="adm__size-input" value={s.stock} min={0}
                      onChange={e => updateSizeStock(s.size, e.target.value)} />
                    <button type="button" className="adm__size-btn" onClick={() => updateSizeStock(s.size, s.stock + 1)}>+</button>
                  </div>
                  <button type="button" className="adm__size-remove" onClick={() => removeSize(s.size)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="adm__sizes-add">
            <div className="adm__sizes-add-fields">
              <select className="adm__sizes-select" value={newSize} onChange={e => setNewSize(e.target.value)}>
                <option value="">Pointure</option>
                {[36,37,38,39,40,41,42,43,44,45,46,47,48].filter(s => !sizes.find(x => x.size === s)).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <input type="number" className="adm__sizes-stock-input" placeholder="Stock" min={0} value={newStock} onChange={e => setNewStock(e.target.value)} />
              <button type="button" className="adm__btn adm__btn--primary adm__btn--sm" onClick={addSize} disabled={!newSize}>
                <i className="fas fa-plus"></i> Ajouter
              </button>
            </div>
          </div>
        </div>

        <div className="adm__form-actions">
          <button type="submit" className="adm__btn adm__btn--primary" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
          <button type="button" className="adm__btn adm__btn--ghost" onClick={onCancel}>Annuler</button>
        </div>
      </form>
    </div>
  );
}
