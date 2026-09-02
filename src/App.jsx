import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/index.css';

function Home() {
  return (
    <>
      <Header cartCount={0} />
      <section className="hero">
        <div className="hero__content">
          <h1 className="hero__title">Des sneakers<br /><span className="hero__title--accent">authentiques</span><br />a Dakar.</h1>
          <p className="hero__subtitle">Ready2Cop, c'est des paires verifiees, livrees chez toi en 24h.</p>
          <div className="hero__cta">
            <a href="/collections" className="btn btn--primary">Voir les sneakers</a>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero__shoe-wrap">
            <img src="/Chaussures-22.jpeg" alt="Sneakers Ready2Cop" className="hero__shoe" />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function Collections() {
  return (
    <>
      <Header cartCount={0} />
      <section style={{ padding: '120px 0', textAlign: 'center' }}>
        <h1>Collections</h1>
      </section>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
