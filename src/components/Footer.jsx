export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <img src="/logo-removebg-preview.png" alt="Ready2Cop" className="footer__logo-img" />
            <p className="footer__tagline">Sneakers authentiques. Livrees au Sénégal en 24h.</p>
            <div className="footer__socials">
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
              <a href="#" aria-label="TikTok"><i className="fab fa-tiktok"></i></a>
              <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="footer__col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/#collections">Collections</a></li>
              <li><a href="/#apropos">A propos</a></li>
              <li><a href="/#contact">Contact</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Service client</h4>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Livraison</a></li>
              <li><a href="#">Retours</a></li>
              <li><a href="#">Guide des tailles</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Contact</h4>
            <ul>
              <li><i className="fab fa-whatsapp"></i> +221 77 123 45 67</li>
              <li><i className="fas fa-location-dot"></i> Senegal</li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; 2024 Ready2Cop. Tous droits reserves.</p>
        </div>
      </div>
    </footer>
  );
}
