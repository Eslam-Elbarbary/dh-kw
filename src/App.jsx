import { createBrowserRouter, RouterProvider, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import VerificationCode from './pages/VerificationCode';
import ForgotPassword from './pages/ForgotPassword';
import ShoppingCart from './pages/ShoppingCart';
import DigitalProductsList from './pages/DigitalProductsList';
import DigitalProductDetail from './pages/DigitalProductDetail';
import DigitalCategoriesList from './pages/DigitalCategoriesList';
import DigitalCategoryDetail from './pages/DigitalCategoryDetail';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import SearchResults from './pages/SearchResults';
import ProductDetail from './pages/ProductDetail';
import PCComponents from './pages/PCComponents';
import Favorites from './pages/Favorites';
import ReportFraud from './pages/ReportFraud';
import TrackOrder from './pages/TrackOrder';
import HelpCenter from './pages/HelpCenter';
import { VENDOR_REGISTER_URL } from './utils/vendorUrls';
import AboutUs from './pages/AboutUs';
import FAQs from './pages/FAQs';
import ContactUs from './pages/ContactUs';
import DeliveryReturn from './pages/DeliveryReturn';
import MyAccount from './pages/MyAccount';
import Returns from './pages/Returns';
import SiteMap from './pages/SiteMap';
import MyProfile from './pages/MyProfile';
import MyOrders from './pages/MyOrders';
import DigitalOrderDetail from './pages/DigitalOrderDetail';
import Compare from './pages/Compare';
import Notifications from './pages/Notifications';
import MyTickets from './pages/MyTickets';
import ErrorPage from './pages/ErrorPage';
import { PageLoader } from './components/Loader';

function VendorRegisterRedirect() {
  useEffect(() => {
    window.location.replace(VENDOR_REGISTER_URL);
  }, []);
  return (
    <div className="min-h-[40vh] flex items-center justify-center font-['Poppins'] text-[#666] dark:text-[#94a3b8] px-[16px] text-center text-[15px]">
      Redirecting to vendor registration…
    </div>
  );
}

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

// Define routes using createBrowserRouter (React Router v7 recommended approach)
const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/digital-e-cards',
        element: <Navigate to="/digital-products" replace />,
      },
      {
        path: '/digital-products',
        element: <DigitalProductsList />,
      },
      {
        path: '/digital-categories',
        element: <DigitalCategoriesList />,
      },
      {
        path: '/digital-category/:id',
        element: <DigitalCategoryDetail />,
      },
      {
        path: '/digital-product/:id',
        element: <DigitalProductDetail />,
      },
      {
        path: '/shopping-cart',
        element: <ShoppingCart />,
      },
      {
        path: '/cart',
        element: <ShoppingCart />,
      },
      {
        path: '/checkout',
        element: <Checkout />,
      },
      {
        path: '/search',
        element: <SearchResults />,
      },
      {
        path: '/product/:id',
        element: <ProductDetail />,
      },
      {
        path: '/pc-components',
        element: <PCComponents />,
      },
      {
        path: '/favorite',
        element: <Favorites />,
      },
      {
        path: '/track-order',
        element: <TrackOrder />,
      },
      {
        path: '/report-fraud',
        element: <ReportFraud />,
      },
      {
        path: '/help-center',
        element: <HelpCenter />,
      },
      {
        path: '/become-a-seller',
        element: <VendorRegisterRedirect />,
      },
      {
        path: '/about-us',
        element: <AboutUs />,
      },
      {
        path: '/faqs',
        element: <FAQs />,
      },
      {
        path: '/contact-us',
        element: <ContactUs />,
      },
      {
        path: '/delivery-return',
        element: <DeliveryReturn />,
      },
      {
        path: '/my-account',
        element: <MyAccount />,
      },
      {
        path: '/returns',
        element: <Returns />,
      },
      {
        path: '/site-map',
        element: <SiteMap />,
      },
      {
        path: '/my-profile',
        element: <MyProfile />,
      },
      {
        path: '/my-orders',
        element: <MyOrders />,
      },
      {
        path: '/digital-order/:id',
        element: <DigitalOrderDetail />,
      },
      {
        path: '/compare',
        element: <Compare />,
      },
      {
        path: '/notifications',
        element: <Notifications />,
      },
      {
        path: '/my-tickets',
        element: <MyTickets />,
      },
      {
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/verification',
    element: <VerificationCode />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
]);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
