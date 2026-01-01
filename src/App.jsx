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
import ProductDetail from './pages/ProductDetail';
import PCComponents from './pages/PCComponents';
import Favorites from './pages/Favorites';
import ReportFraud from './pages/ReportFraud';

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
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/pc-components" element={<PCComponents />} />
            <Route path="/favorite" element={<Favorites />} />
            <Route path="/track-order" element={<div className="min-h-screen bg-white flex items-center justify-center">Track Order Page - Coming Soon</div>} />
            <Route path="/report-fraud" element={<ReportFraud />} />
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
