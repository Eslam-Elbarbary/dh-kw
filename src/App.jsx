import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
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
import TrackOrder from './pages/TrackOrder';
import HelpCenter from './pages/HelpCenter';
import BecomeASeller from './pages/BecomeASeller';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';
import ContactUs from './pages/ContactUs';
import DeliveryReturn from './pages/DeliveryReturn';
import MyAccount from './pages/MyAccount';
import Brands from './pages/Brands';
import Returns from './pages/Returns';
import SiteMap from './pages/SiteMap';
import MyProfile from './pages/MyProfile';
import MyOrders from './pages/MyOrders';
import Compare from './pages/Compare';
import Notifications from './pages/Notifications';
import ErrorPage from './pages/ErrorPage';
import { PageLoader } from './components/Loader';

function AppLayout() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Show loader on route change
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300); // Small delay for smooth transition

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {loading && <PageLoader />}
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
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
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/report-fraud" element={<ReportFraud />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/become-a-seller" element={<BecomeASeller />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/faqs" element={<FAQs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/delivery-return" element={<DeliveryReturn />} />
            <Route path="/my-account" element={<MyAccount />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/site-map" element={<SiteMap />} />
            <Route path="/my-profile" element={<MyProfile />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/notifications" element={<Notifications />} />
            {/* Error Page - Catch all unmatched routes */}
            <Route path="*" element={<ErrorPage />} />
          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/verification" element={<VerificationCode />} />
          <Route path="/cart" element={<ShoppingCart />} />
        </Routes>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
