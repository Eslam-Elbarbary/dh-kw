import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import VerificationCode from './pages/VerificationCode';
import ShoppingCart from './pages/ShoppingCart';
import DigitalECards from './pages/DigitalECards';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';

function AppLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/digital-e-cards" element={<DigitalECards />} />
            <Route path="/shopping-cart" element={<ShoppingCart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/favorite" element={<div className="min-h-screen bg-white flex items-center justify-center">Favorites Page - Coming Soon</div>} />
            <Route path="/track-order" element={<div className="min-h-screen bg-white flex items-center justify-center">Track Order Page - Coming Soon</div>} />
            <Route path="/report-fraud" element={<div className="min-h-screen bg-white flex items-center justify-center">Report Fraud Page - Coming Soon</div>} />
          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/verification" element={<VerificationCode />} />
          <Route path="/cart" element={<ShoppingCart />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
