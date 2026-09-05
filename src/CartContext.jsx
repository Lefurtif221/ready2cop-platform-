import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import API from './api';

const CartContext = createContext();

function loadCart() {
  try {
    const data = localStorage.getItem('r2c_cart');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  // Fetch stock from API on mount to sync old cart items
  useEffect(() => {
    const loadStock = async () => {
      try {
        const res = await API.get('/products');
        const products = Array.isArray(res.data) ? res.data : [];
        setItems(prev => {
          let changed = false;
          const updated = prev.map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return item;
            const sizeObj = (product.sizes || []).find(s => s.size === item.size);
            const newStock = sizeObj ? sizeObj.stock : (product.stock || 0);
            if (item.stock !== newStock) { changed = true; return { ...item, stock: newStock }; }
            return item;
          });
          return changed ? updated : prev;
        });
      } catch {}
    };
    loadStock();
  }, []);

  useEffect(() => {
    localStorage.setItem('r2c_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, size, stock) => {
    setItems(prev => {
      const key = size ? `${product.id}-${size}` : `${product.id}`;
      const exists = prev.find(p => {
        const pKey = p.size ? `${p.id}-${p.size}` : `${p.id}`;
        return pKey === key;
      });
      if (exists) {
        return prev.map(p => {
          const pKey = p.size ? `${p.id}-${p.size}` : `${p.id}`;
          return pKey === key ? { ...p, qty: p.qty + 1 } : p;
        });
      }
      return [...prev, { ...product, qty: 1, size: size || null, stock: stock || 0 }];
    });
  }, []);

  const updateQty = useCallback((productId, size, qty) => {
    if (qty < 1) {
      setItems(prev => prev.filter(p => {
        const pKey = p.size ? `${p.id}-${p.size}` : `${p.id}`;
        const tKey = size ? `${productId}-${size}` : `${productId}`;
        return pKey !== tKey;
      }));
      return;
    }
    setItems(prev => prev.map(p => {
      const pKey = p.size ? `${p.id}-${p.size}` : `${p.id}`;
      const tKey = size ? `${productId}-${size}` : `${productId}`;
      return pKey === tKey ? { ...p, qty } : p;
    }));
  }, []);

  const removeItem = useCallback((productId, size) => {
    setItems(prev => prev.filter(p => {
      const pKey = p.size ? `${p.id}-${p.size}` : `${p.id}`;
      const tKey = size ? `${productId}-${size}` : `${productId}`;
      return pKey !== tKey;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce((sum, p) => sum + p.qty, 0);
  const total = items.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
