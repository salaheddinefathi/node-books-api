import AppRouter from './AppRouter';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './App.css';
import { BookOpen } from 'lucide-react';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Toaster position="bottom-right" reverseOrder={false} />
            <AppRouter />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
