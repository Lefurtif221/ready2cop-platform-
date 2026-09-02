import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext();

function loadCart() {
  try {
    const data = localStorage.getItem('r2c_cart');
    return data ? JSON.parse(data) : [];
  } catch { return []; }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  useEffect(() => {
    localStorage.setItem('r2c_cart', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce((sum, p) => sum + p.qty, 0);
  const total = items.reduce((sum, p) => sum + p.price * p.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
