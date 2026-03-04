import AppRouter from './AppRouter';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { BookOpen, Instagram, Twitter, Facebook } from 'lucide-react';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Toaster position="bottom-right" reverseOrder={false} />
            <AppRouter />
            <footer className="footer-simple">
              <div className="container">
                <div className="logo-group">
                  <BookOpen size={24} color="var(--primary)" />
                  <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>Lumina<span>Books</span></span>
                </div>
                <p>Curating the finest literature from across the globe since 2024. Every book in our collection is handpicked for its unique story and timeless value.</p>
                <div className="footer-socials">
                  <a href="#"><Instagram size={20} /></a>
                  <a href="#"><Twitter size={20} /></a>
                  <a href="#"><Facebook size={20} /></a>
                </div>
                <div className="footer-bottom">
                  <p>&copy; 2026 LuminaBooks. Moroccan Bookstore Excellence.</p>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
